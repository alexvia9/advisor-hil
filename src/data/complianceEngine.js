/**
 * Mock deterministic guardrails over advisor draft text.
 * In production: rules engine + lexicon + firm policy service.
 */

const BASE_CHECKS = [
  { id: 'finra-1', label: 'No promissory / guaranteed language', ok: true },
  { id: 'sec-1', label: 'Suitability & risk context present', ok: true },
  { id: 'sec-2', label: 'Required disclosures referenced', ok: true },
]

/**
 * @param {Array<{ id: string, title: string, body: string }>} sections
 */
export function evaluateComplianceFromSections(sections) {
  const combined = sections.map((s) => s.body).join('\n')
  const lower = combined.toLowerCase()

  const checks = BASE_CHECKS.map((c) => ({ ...c }))

  const forbidden = [
    {
      needle: 'guaranteed return',
      checkId: 'finra-1',
      failLabel: 'Promissory language detected (“guaranteed return”)',
    },
    {
      needle: 'risk-free',
      checkId: 'finra-1',
      failLabel: 'Promissory tone detected (“risk-free”)',
    },
    {
      needle: 'will outperform',
      checkId: 'finra-1',
      failLabel: 'Forward-looking performance claim detected',
    },
  ]

  for (const { needle, checkId, failLabel } of forbidden) {
    if (lower.includes(needle)) {
      const idx = checks.findIndex((x) => x.id === checkId)
      if (idx >= 0) {
        checks[idx] = { ...checks[idx], ok: false, label: failLabel }
      }
    }
  }

  if (combined.trim().length < 80) {
    const idx = checks.findIndex((x) => x.id === 'sec-1')
    if (idx >= 0) {
      checks[idx] = {
        ...checks[idx],
        ok: false,
        label: 'Strategy narrative too thin for suitability context',
      }
    }
  }

  const guardrailsPass = checks.every((c) => c.ok)
  return { guardrailsPass, checks }
}
