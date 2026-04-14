import { Check, FileEdit, Send, Sparkles } from 'lucide-react'
import { PHASE } from '../hooks/useAdvisorWorkspace'

const STEPS = [
  {
    key: 'initial',
    label: 'Initial draft',
    sub: 'AI + first guardrail pass',
    icon: Sparkles,
  },
  {
    key: 'fiduciary',
    label: 'Fiduciary oversight',
    sub: 'Your edits · rerun guardrails',
    icon: FileEdit,
  },
  {
    key: 'client',
    label: 'Client draft',
    sub: 'Share-ready summary',
    icon: Send,
  },
]

export function PipelineStepper({
  phase,
  complianceRunLabel,
  complianceStale,
  isDirty,
  reviewAcknowledged,
}) {
  const stepIndex = (() => {
    if (phase === PHASE.CLIENT_SHARE) return 2
    if (phase === PHASE.DRAFTING) return 0
    if (phase === PHASE.EDITOR) {
      if (
        complianceStale ||
        complianceRunLabel === 'post_edit' ||
        isDirty ||
        reviewAcknowledged
      ) {
        return 1
      }
      return 0
    }
    return 0
  })()

  return (
    <ol className="flex flex-col gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 sm:flex-row sm:items-stretch sm:justify-between sm:gap-2">
      {STEPS.map((step, i) => {
        const Icon = step.icon
        const done = i < stepIndex
        const active = i === stepIndex
        return (
          <li
            key={step.key}
            className={`flex flex-1 items-start gap-2 rounded-lg px-2 py-2 sm:flex-col sm:items-center sm:text-center ${
              active ? 'bg-white/10' : ''
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
                done
                  ? 'border-cabin-green-soft bg-cabin-green-mid text-white'
                  : active
                    ? 'border-white bg-white text-cabin-navy'
                    : 'border-white/30 bg-transparent text-white/60'
              }`}
            >
              {done ? (
                <Check className="h-4 w-4" aria-hidden />
              ) : (
                <Icon className="h-4 w-4" aria-hidden />
              )}
            </div>
            <div className="min-w-0 text-left sm:text-center">
              <p className="text-xs font-bold uppercase tracking-wide text-white/55">
                Step {i + 1}
              </p>
              <p className="text-sm font-semibold leading-tight text-white">
                {step.label}
              </p>
              <p className="text-xs text-white/65">{step.sub}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
