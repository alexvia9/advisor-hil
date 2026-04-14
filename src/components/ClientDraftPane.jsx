import { FileText } from 'lucide-react'

export function ClientDraftPane({ clientDraft }) {
  if (!clientDraft) return null

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border border-cabin-cream-dark bg-white shadow-md">
      <div className="border-b border-cabin-cream-dark px-5 py-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-cabin-green-mid" aria-hidden />
          <h2 className="text-lg font-semibold text-cabin-navy">
            Client draft
          </h2>
        </div>
        <p className="mt-1 text-xl font-semibold tracking-tight text-cabin-navy">
          {clientDraft.title}
        </p>
        <p className="text-sm text-cabin-blue-soft">{clientDraft.subtitle}</p>
      </div>

      <article className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5 text-sm leading-relaxed text-cabin-ink">
        {clientDraft.blocks.map((b, i) => {
          if (b.kind === 'intro' || b.kind === 'closing') {
            return (
              <p key={`${b.kind}-${i}`} className="text-cabin-ink">
                {b.text}
              </p>
            )
          }
          return (
            <section key={`${b.title}-${i}`}>
              <h3 className="mb-2 text-base font-semibold text-cabin-navy">
                {b.title}
              </h3>
              <p className="whitespace-pre-wrap text-cabin-ink">{b.text}</p>
            </section>
          )
        })}
      </article>
    </div>
  )
}
