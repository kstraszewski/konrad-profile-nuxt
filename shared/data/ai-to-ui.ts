import type { AiToUiComparisonReply } from '../types/ai-to-ui.ts'

// Default context for the model and the example questions.
export const aiToUiScenario = {
  title: 'A 5 m² bathroom renovation',
  summary: 'An apartment in a 1980s building. The tub makes way for a walk-in shower, with new tile and plumbing.',
} as const

// Kept outside the chat history. Opening the sample never calls the model.
export const sampleComparison: Pick<AiToUiComparisonReply, 'answer' | 'contractors'> = {
  answer: 'Oak Tile has the lower quote. Blue Finch can start a week sooner and offers a longer warranty.',
  contractors: [
    { id: 'oak-tile', name: 'Oak Tile', note: 'Tiles and plumbing included.', priceZl: 14800, startInDays: 14, workDays: 10, warrantyMonths: 12, rating: 4.7, reviews: 28 },
    { id: 'blue-finch', name: 'Blue Finch', note: 'Includes waterproofing inspection.', priceZl: 16200, startInDays: 7, workDays: 9, warrantyMonths: 24, rating: 4.8, reviews: 34 },
  ],
}
