/**
 * Produces a client-shareable summary from the advisor-edited sections.
 * Plain language, no internal source IDs — suitable for email or PDF export stub.
 */

/** @param {{ transcriptId: string, portfolioId: string }} selection */
export function buildClientDraft(selection, sections) {
  const isMorgan =
    selection.transcriptId === 'tr-onboarding' &&
    selection.portfolioId === 'pf-morgan'

  const household = isMorgan ? 'your organization' : 'your household'

  const intro = isMorgan
    ? `Thank you for the continued trust you place in us. This note summarizes how we propose to invest and deploy liquidity after your recent transition, in language you can share with stakeholders who are not immersed in markets day to day.`
    : `Thank you for the time we spent planning together. This letter summarizes the investment approach we recommend for ${household} in plain terms you can keep for your records or share with family.`

  const closing = `We will review this strategy with you at least annually, or sooner if your goals, cash needs, or comfort with risk change. Past performance does not guarantee future results. This summary is educational and not a substitute for personalized tax or legal advice. Please reach out with any questions.`

  const blocks = [
    { kind: 'intro', text: intro },
    ...sections.map((s) => ({
      kind: 'section',
      title: clientTitleForSection(s.title, isMorgan),
      text: s.body.trim(),
    })),
    { kind: 'closing', text: closing },
  ]

  const plainText = blocks
    .map((b) => {
      if (b.kind === 'section') return `${b.title}\n\n${b.text}`
      return b.text
    })
    .join('\n\n')

  return {
    title: isMorgan
      ? 'Investment approach — summary for your files'
      : 'Your investment strategy — summary for your files',
    subtitle: new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    blocks,
    plainText,
  }
}

function clientTitleForSection(advisorTitle, isMorgan) {
  const t = advisorTitle.toLowerCase()
  if (t.includes('situation')) return isMorgan ? 'Where things stand' : 'What we heard from you'
  if (t.includes('liquidity') || t.includes('cash-flow') || t.includes('deployment'))
    return 'Cash and upcoming needs'
  if (t.includes('allocation') || t.includes('strategic'))
    return 'How we propose to invest'
  if (t.includes('implementation') || t.includes('disclosure'))
    return 'How we will stay on track'
  return advisorTitle
}
