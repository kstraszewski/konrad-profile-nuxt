// Rounded total from ChatGPT, confirmed by Konrad on 17 November 2026.
// This is a manual snapshot; GitHub contributions are fetched separately.
export const codexUsage = {
  totalTokens: 105_300_000_000,
  approximate: true,
  recordedAt: '2026-11-17',
  source: 'ChatGPT usage total confirmed by Konrad',
} as const

export const formatCodexTokens = () => new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
}).format(codexUsage.totalTokens)
