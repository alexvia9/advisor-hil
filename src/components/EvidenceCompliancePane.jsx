import {
  AlertTriangle,
  BookOpen,
  Loader2,
  Scale,
  ShieldCheck,
  ShieldOff,
} from 'lucide-react'
import { PHASE } from '../hooks/useAdvisorWorkspace'

export function EvidenceCompliancePane({
  evidence,
  compliance,
  complianceStale,
  complianceRunLabel,
  guardrailsBusy,
  onRerunGuardrails,
  phase,
  activeSectionId,
  transcripts,
  portfolios,
  transcriptId,
  portfolioId,
}) {
  const transcript = transcripts.find((t) => t.id === transcriptId)
  const portfolio = portfolios.find((p) => p.id === portfolioId)
  const showAdvisorEvidence =
    phase === PHASE.EDITOR || phase === PHASE.DRAFTING

  const runLabelText =
    complianceRunLabel === 'initial_rag'
      ? 'Last run: initial retrieval & generation'
      : complianceRunLabel === 'post_edit'
        ? 'Last run: post-edit guardrails'
        : null

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="rounded-2xl border border-cabin-cream-dark bg-white p-5 shadow-md">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-cabin-navy" aria-hidden />
            <h2 className="text-lg font-semibold text-cabin-navy">
              Hard guardrails
            </h2>
          </div>
          {phase === PHASE.EDITOR && (
            <button
              type="button"
              onClick={onRerunGuardrails}
              disabled={guardrailsBusy || !compliance}
              className="inline-flex items-center gap-2 rounded-lg border border-cabin-cream-dark bg-cabin-cream px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-cabin-navy hover:bg-cabin-cream-dark/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {guardrailsBusy ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                  Scanning…
                </>
              ) : (
                'Rerun guardrails'
              )}
            </button>
          )}
        </div>
        <p className="mb-3 text-xs text-cabin-blue-soft">
          FINRA / SEC–style checks (mock) on the <strong>current</strong> advisor
          draft text. Rerun after any edit so the gate matches what you will sign.
        </p>

        {complianceStale && phase === PHASE.EDITOR && (
          <div className="mb-3 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
              aria-hidden
            />
            <span>
              Text changed since the last passing scan. Rerun guardrails before
              fiduciary approval.
            </span>
          </div>
        )}

        {runLabelText && !complianceStale && (
          <p className="mb-3 text-xs font-medium text-cabin-green-mid">
            {runLabelText}
          </p>
        )}

        {!compliance && (
          <p className="text-sm text-cabin-blue-soft">Awaiting generation…</p>
        )}

        {compliance && (
          <>
            <div
              className={`mb-4 flex items-center gap-3 rounded-xl border px-4 py-3 ${
                compliance.guardrailsPass
                  ? 'border-cabin-green-mid/40 bg-cabin-green-soft'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              {compliance.guardrailsPass ? (
                <ShieldCheck
                  className="h-10 w-10 shrink-0 text-cabin-green-mid"
                  aria-hidden
                />
              ) : (
                <ShieldOff className="h-10 w-10 shrink-0 text-red-600" aria-hidden />
              )}
              <div>
                <p className="font-semibold text-cabin-navy">
                  {compliance.guardrailsPass
                    ? 'Compliance gate: clear'
                    : 'Compliance gate: blocked'}
                </p>
                <p className="text-xs text-cabin-blue-soft">
                  {compliance.guardrailsPass
                    ? 'No hard violations in the current mock scan.'
                    : 'Fix flagged items, then rerun guardrails.'}
                </p>
              </div>
            </div>
            <ul className="space-y-2">
              {compliance.checks.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-cabin-cream-dark bg-cabin-cream/50 px-3 py-2 text-sm"
                >
                  <span className="text-cabin-ink">{c.label}</span>
                  <span
                    className={
                      c.ok
                        ? 'font-semibold text-cabin-green-mid'
                        : 'font-semibold text-red-600'
                    }
                  >
                    {c.ok ? 'Pass' : 'Fail'}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="min-h-0 flex-1 rounded-2xl border border-cabin-cream-dark bg-white p-5 shadow-md">
        <div className="mb-3 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-cabin-blue" aria-hidden />
          <h2 className="text-lg font-semibold text-cabin-navy">
            Reasoning & evidence
          </h2>
        </div>
        {phase === PHASE.CLIENT_SHARE ? (
          <p className="text-sm text-cabin-blue-soft">
            Source-level citations stay in the advisor workspace only. The client
            draft uses plain-language summaries without internal document IDs.
          </p>
        ) : (
          <>
            <p className="mb-4 text-xs text-cabin-blue-soft">
              Retrieved snippets tied to draft sections. Active section
              highlighted when you focus an editor.
            </p>

            {(transcript || portfolio) && (
              <div className="mb-4 space-y-2 rounded-xl bg-cabin-cream/60 p-3 text-xs">
                {transcript && (
                  <p>
                    <span className="font-semibold text-cabin-navy">
                      Ingested:{' '}
                    </span>
                    {transcript.label}
                  </p>
                )}
                {portfolio && (
                  <p>
                    <span className="font-semibold text-cabin-navy">
                      Portfolio:{' '}
                    </span>
                    {portfolio.label}
                  </p>
                )}
              </div>
            )}

            <ul className="max-h-[min(420px,50vh)] space-y-3 overflow-y-auto pr-1">
              {evidence.length === 0 && (
                <li className="text-sm text-cabin-blue-soft">
                  Evidence appears after RAG completes.
                </li>
              )}
              {showAdvisorEvidence &&
                evidence.map((ev) => {
                  const touchesActive =
                    activeSectionId &&
                    ev.linkedSectionIds?.includes(activeSectionId)
                  return (
                    <li
                      key={ev.id}
                      className={`rounded-xl border px-3 py-3 text-sm transition-colors ${
                        touchesActive
                          ? 'border-cabin-blue bg-cabin-blue/5'
                          : 'border-cabin-cream-dark bg-cabin-cream/30'
                      }`}
                    >
                      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-1">
                        <span className="text-xs font-bold uppercase tracking-wide text-cabin-green-mid">
                          {ev.sourceType}
                        </span>
                        <span className="font-mono text-xs text-cabin-blue-soft">
                          {ev.sourceId}
                        </span>
                      </div>
                      <p className="leading-snug text-cabin-ink">{ev.excerpt}</p>
                      <p className="mt-2 text-xs text-cabin-blue-soft">
                        Grounds:{' '}
                        <span className="font-medium text-cabin-navy">
                          {ev.linkedSectionIds?.join(', ') ?? '—'}
                        </span>
                      </p>
                    </li>
                  )
                })}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
