import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { buildClientDraft } from '../data/clientDraftBuilder'
import { evaluateComplianceFromSections } from '../data/complianceEngine'
import {
  buildMockRagResponse,
  PORTFOLIOS,
  TRANSCRIPTS,
} from '../data/mockRagResponse'

export const PHASE = {
  AWAITING_INGEST: 'awaiting_ingest',
  READY_TO_GENERATE: 'ready_to_generate',
  DRAFTING: 'drafting',
  EDITOR: 'editor',
  CLIENT_SHARE: 'client_share',
}

const RAG_DURATION_MS = 2000
const GUARDRAIL_DELAY_MS = 900

function bodiesSignature(sections) {
  return JSON.stringify(
    sections.map((s) => ({ id: s.id, body: s.body.trim() })),
  )
}

/**
 * Pipeline: (1) Initial AI draft + first guardrail pass → (2) Advisor edits +
 * rerun guardrails on current text → (3) Client-shareable summary after fiduciary approve.
 */
export function useAdvisorWorkspace() {
  const [transcriptId, setTranscriptId] = useState('')
  const [portfolioId, setPortfolioId] = useState('')
  const [phase, setPhase] = useState(PHASE.AWAITING_INGEST)
  const [ragProgress, setRagProgress] = useState(0)
  const [ragLabel, setRagLabel] = useState('')

  const [sections, setSections] = useState([])
  const [evidence, setEvidence] = useState([])
  const [compliance, setCompliance] = useState(null)
  /** Signature of section bodies last time guardrails passed */
  const [lastHardenedSignature, setLastHardenedSignature] = useState(null)
  const [complianceRunLabel, setComplianceRunLabel] = useState(null)

  const [guardrailsBusy, setGuardrailsBusy] = useState(false)

  const [baselineBySectionId, setBaselineBySectionId] = useState({})
  const [reviewAcknowledged, setReviewAcknowledged] = useState(false)

  const [clientDraft, setClientDraft] = useState(null)

  const progressTimerRef = useRef(null)
  const ragCompleteTimerRef = useRef(null)
  const guardrailTimerRef = useRef(null)
  const guardrailBusyRef = useRef(false)

  const canGenerate = Boolean(transcriptId && portfolioId)

  const complianceStale = useMemo(() => {
    if (!sections.length || lastHardenedSignature == null) return false
    return bodiesSignature(sections) !== lastHardenedSignature
  }, [sections, lastHardenedSignature])

  const isDirty = useMemo(() => {
    if (!sections.length || !Object.keys(baselineBySectionId).length) return false
    return sections.some((s) => {
      const base = baselineBySectionId[s.id]
      return base !== undefined && s.body.trim() !== base.trim()
    })
  }, [sections, baselineBySectionId])

  const canFiduciaryApprove = useMemo(() => {
    if (phase !== PHASE.EDITOR || !compliance) return false
    if (guardrailsBusy) return false
    if (complianceStale) return false
    if (!compliance.guardrailsPass) return false
    return reviewAcknowledged || isDirty
  }, [
    phase,
    compliance,
    complianceStale,
    guardrailsBusy,
    reviewAcknowledged,
    isDirty,
  ])

  const clearTimers = useCallback(() => {
    if (progressTimerRef.current) {
      window.clearInterval(progressTimerRef.current)
      progressTimerRef.current = null
    }
    if (ragCompleteTimerRef.current) {
      window.clearTimeout(ragCompleteTimerRef.current)
      ragCompleteTimerRef.current = null
    }
    if (guardrailTimerRef.current) {
      window.clearTimeout(guardrailTimerRef.current)
      guardrailTimerRef.current = null
    }
    guardrailBusyRef.current = false
  }, [])

  useEffect(() => () => clearTimers(), [clearTimers])

  useEffect(() => {
    if (phase === PHASE.DRAFTING) return
    if (canGenerate && phase === PHASE.AWAITING_INGEST) {
      setPhase(PHASE.READY_TO_GENERATE)
    }
    if (!canGenerate && phase === PHASE.READY_TO_GENERATE) {
      setPhase(PHASE.AWAITING_INGEST)
    }
  }, [canGenerate, phase])

  const runComplianceOnSections = useCallback((secs, label) => {
    const result = evaluateComplianceFromSections(secs)
    setCompliance(result)
    setComplianceRunLabel(label)
    if (result.guardrailsPass) {
      setLastHardenedSignature(bodiesSignature(secs))
    }
    return result
  }, [])

  const resetWorkspace = useCallback(() => {
    clearTimers()
    guardrailBusyRef.current = false
    setGuardrailsBusy(false)
    setTranscriptId('')
    setPortfolioId('')
    setPhase(PHASE.AWAITING_INGEST)
    setRagProgress(0)
    setRagLabel('')
    setSections([])
    setEvidence([])
    setCompliance(null)
    setLastHardenedSignature(null)
    setComplianceRunLabel(null)
    setBaselineBySectionId({})
    setReviewAcknowledged(false)
    setClientDraft(null)
  }, [clearTimers])

  const applyMockResponse = useCallback(
    (selection) => {
      const payload = buildMockRagResponse(selection)
      const baselines = {}
      const nextSections = payload.sections.map((s) => {
        baselines[s.id] = s.body
        return { ...s, body: s.body }
      })
      setSections(nextSections)
      setEvidence(payload.evidence)
      setBaselineBySectionId(baselines)
      setReviewAcknowledged(false)
      setClientDraft(null)
      runComplianceOnSections(nextSections, 'initial_rag')
      setPhase(PHASE.EDITOR)
      setRagProgress(100)
      setRagLabel('RAG complete — initial draft ready')
    },
    [runComplianceOnSections],
  )

  const startGeneration = useCallback(() => {
    if (!canGenerate) return
    clearTimers()
    setGuardrailsBusy(false)
    setReviewAcknowledged(false)
    setSections([])
    setEvidence([])
    setCompliance(null)
    setLastHardenedSignature(null)
    setComplianceRunLabel(null)
    setBaselineBySectionId({})
    setClientDraft(null)
    setPhase(PHASE.DRAFTING)
    setRagProgress(0)
    setRagLabel('Retrieving embeddings & policy documents…')

    const start = performance.now()
    progressTimerRef.current = window.setInterval(() => {
      const elapsed = performance.now() - start
      const pct = Math.min(100, Math.round((elapsed / RAG_DURATION_MS) * 100))
      setRagProgress(pct)
      if (pct < 35) setRagLabel('Retrieving embeddings & policy documents…')
      else if (pct < 70) setRagLabel('Grounding to approved models & client facts…')
      else setRagLabel('Synthesizing strategy draft & running rule engine…')
    }, 50)

    ragCompleteTimerRef.current = window.setTimeout(() => {
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current)
        progressTimerRef.current = null
      }
      applyMockResponse({ transcriptId, portfolioId })
    }, RAG_DURATION_MS)
  }, [applyMockResponse, canGenerate, clearTimers, portfolioId, transcriptId])

  const rerunGuardrails = useCallback(() => {
    if (!sections.length || phase !== PHASE.EDITOR) return
    if (guardrailBusyRef.current) return
    guardrailBusyRef.current = true
    setGuardrailsBusy(true)
    if (guardrailTimerRef.current) {
      window.clearTimeout(guardrailTimerRef.current)
    }
    guardrailTimerRef.current = window.setTimeout(() => {
      const result = evaluateComplianceFromSections(sections)
      setCompliance(result)
      setComplianceRunLabel('post_edit')
      if (result.guardrailsPass) {
        setLastHardenedSignature(bodiesSignature(sections))
      }
      guardrailBusyRef.current = false
      setGuardrailsBusy(false)
      guardrailTimerRef.current = null
    }, GUARDRAIL_DELAY_MS)
  }, [phase, sections])

  const updateSectionBody = useCallback((sectionId, body) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, body } : s)),
    )
  }, [])

  const approveFiduciaryAndBuildClient = useCallback(() => {
    if (!canFiduciaryApprove) return
    const draft = buildClientDraft(
      { transcriptId, portfolioId },
      sections,
    )
    setClientDraft(draft)
    setPhase(PHASE.CLIENT_SHARE)
  }, [canFiduciaryApprove, portfolioId, sections, transcriptId])

  const backToAdvisorDraft = useCallback(() => {
    setPhase(PHASE.EDITOR)
    setClientDraft(null)
  }, [])

  const copyClientPlainText = useCallback(async () => {
    if (!clientDraft?.plainText) return
    try {
      await navigator.clipboard.writeText(clientDraft.plainText)
    } catch {
      // eslint-disable-next-line no-alert
      window.alert('Could not copy to clipboard.')
    }
  }, [clientDraft])

  return {
    transcripts: TRANSCRIPTS,
    portfolios: PORTFOLIOS,
    transcriptId,
    setTranscriptId,
    portfolioId,
    setPortfolioId,
    phase,
    ragProgress,
    ragLabel,
    sections,
    evidence,
    compliance,
    complianceStale,
    complianceRunLabel,
    guardrailsBusy,
    baselineBySectionId,
    reviewAcknowledged,
    setReviewAcknowledged,
    isDirty,
    canGenerate,
    canFiduciaryApprove,
    clientDraft,
    resetWorkspace,
    startGeneration,
    updateSectionBody,
    rerunGuardrails,
    approveFiduciaryAndBuildClient,
    backToAdvisorDraft,
    copyClientPlainText,
  }
}
