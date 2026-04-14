import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  RefreshCw,
  Shield,
} from 'lucide-react'
import { PipelineStepper } from './PipelineStepper'
import { PHASE } from '../hooks/useAdvisorWorkspace'

export function WorkspaceToolbar({
  phase,
  canGenerate,
  canFiduciaryApprove,
  reviewAcknowledged,
  isDirty,
  complianceStale,
  complianceRunLabel,
  onGenerate,
  onReset,
  onApproveFiduciary,
  onBackToAdvisor,
  onCopyClient,
  setReviewAcknowledged,
}) {
  const isClient = phase === PHASE.CLIENT_SHARE

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-cabin-cream-dark bg-cabin-navy px-4 py-4 text-white shadow-lg">
      <PipelineStepper
        phase={phase}
        complianceRunLabel={complianceRunLabel}
        complianceStale={complianceStale}
        isDirty={isDirty}
        reviewAcknowledged={reviewAcknowledged}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm">
          <p className="font-semibold">Human-in-the-loop</p>
          <p className="text-white/75">
            {isClient &&
              'Client summary is ready to copy or export. Return to advisor view to change wording.'}
            {!isClient && phase === PHASE.EDITOR && complianceStale && (
              <>
                <Shield className="mr-1 inline h-3.5 w-3.5 text-amber-300" aria-hidden />
                Guardrails are <strong className="text-white">out of date</strong> — rerun
                after edits before fiduciary approval.
              </>
            )}
            {!isClient &&
              phase === PHASE.EDITOR &&
              !complianceStale &&
              !canFiduciaryApprove && (
                <>Acknowledge review or edit the draft, then rerun guardrails if you edit.</>
              )}
            {!isClient &&
              phase === PHASE.EDITOR &&
              !complianceStale &&
              canFiduciaryApprove && (
                <>Guardrails match the current text — you may approve and build the client draft.</>
              )}
            {phase === PHASE.DRAFTING && 'Grounding draft — please wait…'}
            {(phase === PHASE.AWAITING_INGEST ||
              phase === PHASE.READY_TO_GENERATE) &&
              'Select sources above, then generate an initial grounded draft.'}
          </p>
          {phase === PHASE.EDITOR && (
            <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-white/90">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-white/40 text-cabin-green-mid focus:ring-cabin-green-soft"
                checked={reviewAcknowledged}
                onChange={(e) => setReviewAcknowledged(e.target.checked)}
              />
              I have reviewed the initial AI draft (counts toward oversight)
            </label>
          )}
          {phase === PHASE.EDITOR && isDirty && (
            <p className="mt-1 text-xs text-cabin-green-soft">
              Edits detected — fiduciary refinement in progress.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/15"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Reset
          </button>

          {isClient ? (
            <>
              <button
                type="button"
                onClick={onBackToAdvisor}
                className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/15"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back to advisor draft
              </button>
              <button
                type="button"
                onClick={onCopyClient}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-cabin-navy shadow"
              >
                <Copy className="h-4 w-4" aria-hidden />
                Copy client text
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onGenerate}
                disabled={
                  !canGenerate ||
                  phase === PHASE.DRAFTING ||
                  phase === PHASE.CLIENT_SHARE
                }
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-cabin-navy shadow disabled:cursor-not-allowed disabled:opacity-40"
                title={
                  phase === PHASE.EDITOR
                    ? 'Regenerate from sources (replaces current advisor draft).'
                    : undefined
                }
              >
                {phase === PHASE.EDITOR ? 'Regenerate' : 'Generate draft'}
              </button>
              <button
                type="button"
                onClick={onApproveFiduciary}
                disabled={!canFiduciaryApprove}
                className="inline-flex items-center gap-2 rounded-lg bg-cabin-green-mid px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-cabin-green disabled:cursor-not-allowed disabled:opacity-40"
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                Approve fiduciary · create client draft
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
