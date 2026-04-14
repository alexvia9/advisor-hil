/**
 * Mock RAG payload — simulates grounded strategy + evidence links.
 * In production this would come from an API after retrieval + generation.
 */

export const TRANSCRIPTS = [
  {
    id: 'tr-q1-review',
    label: 'Q1 review — Jordan Lee (Mar 14)',
    excerpt:
      'Discussed tuition in 18 months; wants to avoid selling equities in a drawdown to fund it.',
  },
  {
    id: 'tr-onboarding',
    label: 'Onboarding — Morgan Family Office',
    excerpt:
      'Post-liquidity event; tax-efficient deployment over 24 months; charitable ~5% annually.',
  },
]

export const PORTFOLIOS = [
  {
    id: 'pf-lee',
    label: 'Lee household — model moderate growth',
    excerpt: '62% EQ / 28% FI / 10% alt; tax-deferred 55%, taxable 45%.',
  },
  {
    id: 'pf-morgan',
    label: 'Morgan LLC — UHNW sleeve',
    excerpt: 'Elevated cash post-close; ladder for taxes; alts cap 35% until funded.',
  },
]

/** @param {{ transcriptId: string, portfolioId: string }} selection */
export function buildMockRagResponse(selection) {
  const isMorgan =
    selection.transcriptId === 'tr-onboarding' &&
    selection.portfolioId === 'pf-morgan'

  if (isMorgan) {
    return {
      sections: [
        {
          id: 'sec-summary',
          title: 'Situation summary',
          body: 'The entity has completed a significant liquidity event. Near-term priorities are orderly deployment of proceeds, tax-aware scheduling, and alignment with stated charitable intent.',
          confidence: 88,
        },
        {
          id: 'sec-liquidity',
          title: 'Liquidity & deployment',
          body: 'Maintain a short-government ladder for estimated tax obligations before increasing illiquid commitments. Use a disciplined dollar-cost schedule over 6–18 months unless volatility triggers in the playbook are met.',
          confidence: 84,
        },
        {
          id: 'sec-allocation',
          title: 'Strategic allocation',
          body: 'Public equity may be built gradually while alternatives remain below the 35% ceiling until the liquidity ladder is fully funded. Document any tactical deviation from model bands.',
          confidence: 81,
        },
        {
          id: 'sec-impl',
          title: 'Implementation & disclosures',
          body: 'Quarterly rebalance review; attach required regulatory disclosures before client delivery. Past performance does not guarantee future results.',
          confidence: 76,
        },
      ],
      evidence: [
        {
          id: 'ev-crm',
          sourceType: 'CRM',
          sourceId: 'CRM-9920',
          excerpt:
            'Liquidity event complete; tax-efficient deployment 24 mo; charitable ~5% annually.',
          linkedSectionIds: ['sec-summary', 'sec-liquidity'],
        },
        {
          id: 'ev-port',
          sourceType: 'Portfolio',
          sourceId: 'PORT-ENT',
          excerpt:
            'Cash sleeve elevated pending IPS refresh; tax reserve in T-bill ladder.',
          linkedSectionIds: ['sec-liquidity', 'sec-allocation'],
        },
        {
          id: 'ev-model',
          sourceType: 'Firm model',
          sourceId: 'MODEL-UHNW-4',
          excerpt:
            'DCA 6–18 mo; alternatives cap 35% until liquidity ladder funded.',
          linkedSectionIds: ['sec-allocation', 'sec-impl'],
        },
      ],
    }
  }

  return {
    sections: [
      {
        id: 'sec-summary',
        title: 'Situation summary',
        body: 'Jordan is planning for retirement in approximately twelve years with a preference for income stability relative to maximum growth, consistent with household goals on file.',
        confidence: 91,
      },
      {
        id: 'sec-liquidity',
        title: 'Liquidity & cash-flow',
        body: 'A tuition-related outflow within eighteen months supports a dedicated short-term reserve in high-quality fixed income or cash equivalents, sized to that liability, to reduce sequence risk from the equity sleeve.',
        confidence: 86,
      },
      {
        id: 'sec-allocation',
        title: 'Strategic allocation',
        body: 'Current equity near 62% sits within the approved moderate-growth glidepath (55–70%). Use the fixed income sleeve to anchor near-term spending and the upcoming tuition need.',
        confidence: 89,
      },
      {
        id: 'sec-impl',
        title: 'Implementation & disclosures',
        body: 'Rebalance on a quarterly schedule; document rationale if tactical deviations exceed model tolerances. Past performance does not guarantee future results.',
        confidence: 78,
      },
    ],
    evidence: [
      {
        id: 'ev-crm',
        sourceType: 'CRM',
        sourceId: 'CRM-8841',
        excerpt:
          'Retire in ~12 yrs; ~72% income replacement; spouse prefers stability.',
        linkedSectionIds: ['sec-summary', 'sec-allocation'],
      },
      {
        id: 'ev-notes',
        sourceType: 'Meeting notes',
        sourceId: 'NOTE-2026-03-14',
        excerpt:
          'Tuition lump sum in 18 mo; avoid selling equities in a down market.',
        linkedSectionIds: ['sec-liquidity'],
      },
      {
        id: 'ev-port',
        sourceType: 'Portfolio',
        sourceId: 'PORT-RT',
        excerpt: '62/28/10 split; tax-deferred vs taxable 55/45.',
        linkedSectionIds: ['sec-allocation', 'sec-liquidity'],
      },
      {
        id: 'ev-model',
        sourceType: 'Firm model',
        sourceId: 'MODEL-LIB-12',
        excerpt: 'Moderate growth: 55–70% equity pre-retirement; quarterly rebalance.',
        linkedSectionIds: ['sec-allocation', 'sec-impl'],
      },
    ],
  }
}
