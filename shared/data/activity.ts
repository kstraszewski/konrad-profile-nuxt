// Rounded total from the Codex profile screenshot supplied on 19 October 2026.
// This is a manual snapshot; GitHub contributions are fetched separately.
export const codexUsage = {
  totalTokens: 84_900_000_000,
  approximate: true,
  recordedAt: '2026-10-19',
  source: 'Codex profile screenshot',
} as const

export const formatCodexTokens = () => new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
}).format(codexUsage.totalTokens)
