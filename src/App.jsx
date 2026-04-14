import { useState } from 'react'
import { ClientDraftPane } from './components/ClientDraftPane'
import { IngestionPanel } from './components/IngestionPanel'
import { RagProgressCard } from './components/RagProgressCard'
import { StrategyDraftPane } from './components/StrategyDraftPane'
import { EvidenceCompliancePane } from './components/EvidenceCompliancePane'
import { WorkspaceToolbar } from './components/WorkspaceToolbar'
import { PHASE, useAdvisorWorkspace } from './hooks/useAdvisorWorkspace'

function App() {
  const [activeSectionId, setActiveSectionId] = useState(null)

  const ws = useAdvisorWorkspace()

  const handleCopyClient = async () => {
    await ws.copyClientPlainText()
    // eslint-disable-next-line no-alert
    window.alert('Client summary copied to clipboard (plain text).')
  }

  return (
    <div className="flex min-h-screen flex-col bg-cabin-cream">
      <IngestionPanel
        transcripts={ws.transcripts}
        portfolios={ws.portfolios}
        transcriptId={ws.transcriptId}
        portfolioId={ws.portfolioId}
        onTranscriptChange={ws.setTranscriptId}
        onPortfolioChange={ws.setPortfolioId}
        phase={ws.phase}
      />

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-4 px-4 py-6 lg:px-6">
        <WorkspaceToolbar
          phase={ws.phase}
          canGenerate={ws.canGenerate}
          canFiduciaryApprove={ws.canFiduciaryApprove}
          reviewAcknowledged={ws.reviewAcknowledged}
          isDirty={ws.isDirty}
          complianceStale={ws.complianceStale}
          complianceRunLabel={ws.complianceRunLabel}
          onGenerate={ws.startGeneration}
          onReset={ws.resetWorkspace}
          onApproveFiduciary={ws.approveFiduciaryAndBuildClient}
          onBackToAdvisor={ws.backToAdvisorDraft}
          onCopyClient={handleCopyClient}
          setReviewAcknowledged={ws.setReviewAcknowledged}
        />

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="flex min-h-[420px] flex-col lg:min-h-[560px]">
            {ws.phase === PHASE.DRAFTING && (
              <RagProgressCard progress={ws.ragProgress} label={ws.ragLabel} />
            )}

            {(ws.phase === PHASE.AWAITING_INGEST ||
              ws.phase === PHASE.READY_TO_GENERATE) && (
              <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-cabin-cream-dark bg-white/60 p-10 text-center shadow-inner">
                <p className="max-w-md text-sm text-cabin-blue-soft">
                  Choose a <strong className="text-cabin-navy">transcript</strong>{' '}
                  and <strong className="text-cabin-navy">portfolio</strong>, then
                  run <strong className="text-cabin-navy">Generate draft</strong>{' '}
                  for the <strong>initial</strong> AI strategy. You will edit,
                  <strong> rerun guardrails</strong> on your text, then unlock a{' '}
                  <strong>client draft</strong>.
                </p>
              </div>
            )}

            {ws.phase === PHASE.EDITOR && (
              <StrategyDraftPane
                sections={ws.sections}
                activeSectionId={activeSectionId}
                onSectionFocus={setActiveSectionId}
                onSectionBodyChange={ws.updateSectionBody}
              />
            )}

            {ws.phase === PHASE.CLIENT_SHARE && (
              <ClientDraftPane clientDraft={ws.clientDraft} />
            )}
          </div>

          <div className="flex min-h-[420px] flex-col lg:min-h-[560px]">
            <EvidenceCompliancePane
              evidence={ws.evidence}
              compliance={ws.compliance}
              complianceStale={ws.complianceStale}
              complianceRunLabel={ws.complianceRunLabel}
              guardrailsBusy={ws.guardrailsBusy}
              onRerunGuardrails={ws.rerunGuardrails}
              phase={ws.phase}
              activeSectionId={activeSectionId}
              transcripts={ws.transcripts}
              portfolios={ws.portfolios}
              transcriptId={ws.transcriptId}
              portfolioId={ws.portfolioId}
            />
          </div>
        </div>

        <footer className="pb-6 text-center text-xs text-cabin-blue-soft">
          Cabin HITL prototype — synthetic data only. Tip: add the phrase{' '}
          <code className="rounded bg-cabin-cream-dark/40 px-1">guaranteed return</code>{' '}
          to a section and rerun guardrails to see a mock block.
        </footer>
      </div>
    </div>
  )
}

export default App
