import { FileText, LineChart, Upload } from 'lucide-react'
import { PHASE } from '../hooks/useAdvisorWorkspace'

export function IngestionPanel({
  transcripts,
  portfolios,
  transcriptId,
  portfolioId,
  onTranscriptChange,
  onPortfolioChange,
  phase,
}) {
  const locked =
    phase === PHASE.DRAFTING ||
    phase === PHASE.EDITOR ||
    phase === PHASE.CLIENT_SHARE

  return (
    <header className="border-b border-cabin-cream-dark bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cabin-navy text-white shadow-md">
            <Upload className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-cabin-navy">
              Data ingestion
            </h1>
            <p className="text-sm text-cabin-blue-soft">
              Select meeting context and portfolio feed to ground the draft (mock
              selectors — no files leave the browser).
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex min-w-[220px] flex-1 flex-col gap-1 text-sm font-medium text-cabin-navy">
            <span className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-cabin-blue-soft">
              <FileText className="h-3.5 w-3.5" aria-hidden />
              Transcript / notes
            </span>
            <select
              className="rounded-lg border border-cabin-cream-dark bg-cabin-cream px-3 py-2.5 text-cabin-ink shadow-inner focus:border-cabin-blue focus:outline-none focus:ring-2 focus:ring-cabin-blue/25 disabled:opacity-50"
              value={transcriptId}
              onChange={(e) => onTranscriptChange(e.target.value)}
              disabled={locked}
            >
              <option value="">Choose source…</option>
              {transcripts.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex min-w-[220px] flex-1 flex-col gap-1 text-sm font-medium text-cabin-navy">
            <span className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-cabin-blue-soft">
              <LineChart className="h-3.5 w-3.5" aria-hidden />
              Portfolio data
            </span>
            <select
              className="rounded-lg border border-cabin-cream-dark bg-cabin-cream px-3 py-2.5 text-cabin-ink shadow-inner focus:border-cabin-blue focus:outline-none focus:ring-2 focus:ring-cabin-blue/25 disabled:opacity-50"
              value={portfolioId}
              onChange={(e) => onPortfolioChange(e.target.value)}
              disabled={locked}
            >
              <option value="">Choose feed…</option>
              {portfolios.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </header>
  )
}

export default IngestionPanel
