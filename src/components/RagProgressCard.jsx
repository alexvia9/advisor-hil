import { Loader2 } from 'lucide-react'

export function RagProgressCard({ progress, label }) {
  return (
    <div className="rounded-2xl border border-cabin-cream-dark bg-white p-8 shadow-md">
      <div className="mb-6 flex items-center gap-3">
        <Loader2
          className="h-8 w-8 animate-spin text-cabin-blue"
          aria-hidden
        />
        <div>
          <h2 className="text-lg font-semibold text-cabin-navy">
            RAG processing
          </h2>
          <p className="text-sm text-cabin-blue-soft">{label}</p>
        </div>
      </div>
      <div
        className="h-3 overflow-hidden rounded-full bg-cabin-cream-dark"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Retrieval and generation progress"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-cabin-blue to-cabin-green-mid transition-[width] duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-4 text-center text-2xl font-bold tabular-nums text-cabin-navy">
        {progress}%
      </p>
      <p className="mt-2 text-center text-xs text-cabin-blue-soft">
        Simulated ~2s pipeline — embeddings, policy retrieval, grounding checks.
      </p>
    </div>
  )
}
