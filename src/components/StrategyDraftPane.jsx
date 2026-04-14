import { PenLine, Sparkles } from 'lucide-react'

function ConfidenceMeter({ value }) {
  const hue =
    value >= 85 ? 'bg-cabin-green-mid' : value >= 75 ? 'bg-cabin-blue' : 'bg-amber-600'
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-cabin-blue-soft">
        AI confidence
      </span>
      <div className="h-2 w-24 overflow-hidden rounded-full bg-cabin-cream-dark">
        <div
          className={`h-full rounded-full ${hue}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm font-bold tabular-nums text-cabin-navy">{value}%</span>
    </div>
  )
}

export function StrategyDraftPane({
  sections,
  activeSectionId,
  onSectionFocus,
  onSectionBodyChange,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border border-cabin-cream-dark bg-white shadow-md">
      <div className="border-b border-cabin-cream-dark px-5 py-4">
        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-cabin-blue-soft">
          Step 2 · Advisor workspace
        </p>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cabin-green-mid" aria-hidden />
          <h2 className="text-lg font-semibold text-cabin-navy">
            Investment strategy draft
          </h2>
        </div>
        <p className="mt-1 text-sm text-cabin-blue-soft">
          <span className="font-semibold text-cabin-green">90%</span> generated &
          grounded — your edits are the{' '}
          <span className="font-semibold text-cabin-navy">10%</span> fiduciary
          refinement. Rerun guardrails after changes, then approve to build the
          client-facing summary.
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {sections.map((s) => (
          <section
            key={s.id}
            className={`rounded-xl border px-4 py-3 transition-colors ${
              activeSectionId === s.id
                ? 'border-cabin-blue/40 bg-cabin-cream/80'
                : 'border-cabin-cream-dark bg-cabin-cream/40'
            }`}
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-cabin-navy">
                <PenLine className="h-4 w-4 text-cabin-blue" aria-hidden />
                {s.title}
              </h3>
              <ConfidenceMeter value={s.confidence} />
            </div>
            <textarea
              className="min-h-[100px] w-full resize-y rounded-lg border border-cabin-cream-dark bg-white px-3 py-2 text-sm leading-relaxed text-cabin-ink shadow-inner focus:border-cabin-blue focus:outline-none focus:ring-2 focus:ring-cabin-blue/20"
              value={s.body}
              onChange={(e) => onSectionBodyChange(s.id, e.target.value)}
              onFocus={() => onSectionFocus(s.id)}
              aria-label={`Edit ${s.title}`}
            />
          </section>
        ))}
      </div>
    </div>
  )
}
