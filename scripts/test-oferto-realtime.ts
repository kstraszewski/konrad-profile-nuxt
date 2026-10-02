import assert from 'node:assert/strict'
import { test } from 'node:test'
import { voiceRequestMessages, mergeOferteoVoiceTranscript, voiceInstructions } from '../shared/oferteo-realtime.ts'
import { chatRequestSchema } from '../server/utils/oferteoCore.ts'
import type { OferteoMessage } from '../shared/types/oferteo.ts'

test('voice fragments and tool acknowledgements produce valid text API history', () => {
  const messages = voiceRequestMessages([
    { role: 'assistant', content: 'Cześć!' },
    { role: 'user', content: 'Warszawa' },
    { role: 'user', content: 'remont łazienki' },
    { role: 'assistant', content: 'Sprawdzam' },
    { role: 'assistant', content: 'Wyniki na kartach' },
    { role: 'user', content: 'Jednak Kraków' },
    { role: 'assistant', content: 'Już sprawdzam nową lokalizację' },
  ], true)
  assert.equal(chatRequestSchema.safeParse({ messages }).success, true)
  assert.equal(messages.at(-1)?.content, 'Jednak Kraków')
  assert.equal(messages[0]?.content, 'Warszawa\nremont łazienki')
})

test('normalization does not truncate or disguise an over-limit voice conversation', () => {
  const messages = voiceRequestMessages([{ role: 'user', content: 'a'.repeat(1000) }, { role: 'user', content: 'b'.repeat(1000) }])
  assert.equal(messages[0]?.content.length, 2001)
  assert.equal(chatRequestSchema.safeParse({ messages }).success, false)
})

test('late captions are inserted before replies and updates do not duplicate cards', () => {
  const messages: (OferteoMessage & { voiceId?: string; result?: string })[] = [
    { role: 'user', content: 'Poprzednia rozmowa' },
    { role: 'assistant', content: 'Sprawdzam', voiceId: '1:reply' },
    { role: 'assistant', content: 'Wyniki', result: 'saved-card' },
  ]
  const transcript = [{ voiceId: '1:user', role: 'user' as const, content: 'Nowe zlecenie' }, { voiceId: '1:reply', role: 'assistant' as const, content: 'Sprawdzam katalog.' }]
  mergeOferteoVoiceTranscript(messages, transcript)
  mergeOferteoVoiceTranscript(messages, transcript)
  assert.equal(messages.length, 4)
  assert.equal(messages[1]?.voiceId, '1:user')
  assert.equal(messages[2]?.content, 'Sprawdzam katalog.')
  assert.equal(messages[3]?.result, 'saved-card')
})

test('voice context cannot accidentally serialize UI metadata or old result cards', () => {
  const message = { role: 'user' as const, content: 'Warszawa', token: 'private-metadata', result: { name: 'old-result' } }
  const instructions = voiceInstructions('search', [message])
  assert.match(instructions, /Warszawa/)
  assert.doesNotMatch(instructions, /private-metadata|old-result/)
  assert.match(voiceInstructions('creator', []), /szkic oferty/)
})
