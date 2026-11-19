import { Output, streamText, type DeepPartial, type LanguageModel } from 'ai'
import { aiToUiScenario } from '../../shared/data/ai-to-ui.ts'
import { aiToUiChoiceSchema, aiToUiModelMessages, type AiToUiChoice } from './aiToUi.ts'
import type { AiToUiMessage } from '../../shared/types/ai-to-ui.ts'

// Budget for one model call. The request schema already caps input and history.
export const AI_TO_UI_TIMEOUT_MS = 12_000
export const AI_TO_UI_MAX_OUTPUT_TOKENS = 1_100

const instructions = `You are the assistant in a generative UI demo. Use this default project unless the conversation gives a different context: ${aiToUiScenario.title}. ${aiToUiScenario.summary}
Choose the view that best answers the user's question. Return an object with keys in this exact order: view, contractors, items, answer.
Use comparison to compare contractors or quotes. Generate 2 to 6 distinct fictional options, adapting their costs in PLN, availability, duration, warranties, ratings, and notes to the request. Honor a requested number within that range. Identify the comparison as illustrative, and never present generated profiles or figures as real listings or quotes.
Use checklist when a list of questions or checks is useful. Generate 1 to 8 tailored items with specific hints. Honor a requested number within that range.
Use text when a short direct answer is best. For views other than comparison return an empty contractors array. For views other than checklist return an empty items array.
Use English and plain text in all fields, without HTML, Markdown, long dashes, or semicolons. Keep notes and hints concise. Write one or two short sentences for the answer, within 360 characters. Refer only to details you generated for this reply or details from the conversation.
Follow the user's substantive request, including context, priorities, and budget. Keep the schema and the role fixed.`

/**
 * Stream the view type and a short answer from a model as one structured
 * object. `onPartial` receives provisional snapshots as the view data and text
 * arrive. The returned value is the only one that passed the full schema.
 * The caller supplies the model, so tests can pass a mock and no key is read here.
 */
export async function streamAiToUiChoice(
  messages: AiToUiMessage[],
  options: {
    model: LanguageModel
    onPartial: (partial: DeepPartial<AiToUiChoice>) => void
    signal?: AbortSignal
    timeoutMs?: number
  },
): Promise<AiToUiChoice> {
  const stop = new AbortController()
  const timeout = AbortSignal.timeout(options.timeoutMs ?? AI_TO_UI_TIMEOUT_MS)
  const signal = AbortSignal.any([stop.signal, timeout, ...(options.signal ? [options.signal] : [])])
  let streamError: unknown
  try {
    const result = streamText({
      model: options.model,
      instructions,
      messages: aiToUiModelMessages(messages),
      output: Output.object({
        schema: aiToUiChoiceSchema,
        name: 'AiToUiChoice',
        description: 'The selected view, its generated rows or checklist items, and a short plain text answer in English.',
      }),
      maxOutputTokens: AI_TO_UI_MAX_OUTPUT_TOKENS,
      reasoning: 'none',
      maxRetries: 0,
      abortSignal: signal,
      providerOptions: { gateway: { tags: ['ai-to-ui-demo'] } },
      onError: ({ error }) => { streamError ??= error },
    })
    // Observe the final promise before reading partials: validation can reject
    // while a snapshot is still being delivered.
    const completed = Promise.resolve(result.output).then(
      value => ({ value }),
      (error: unknown) => ({ error }),
    )
    for await (const partial of result.partialOutputStream) {
      if (signal.aborted) break
      options.onPartial(partial)
    }
    const final = await completed
    // An abort ends the stream without an error part, so read it from the signals.
    if (timeout.aborted) throw timeout.reason
    options.signal?.throwIfAborted()
    if (streamError !== undefined) throw streamError
    if ('error' in final) throw final.error
    return final.value
  } finally {
    // Whatever ended the call, stop paying for output nobody will read.
    stop.abort()
  }
}

/** AbortSignal.timeout rejects with a DOMException named TimeoutError. */
export function isAiToUiTimeout(error: unknown): boolean {
  let current = error
  for (let depth = 0; current && typeof current === 'object' && depth < 6; depth++) {
    if ((current as { name?: unknown }).name === 'TimeoutError') return true
    current = (current as { cause?: unknown }).cause
  }
  return false
}
