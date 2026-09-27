import assert from 'node:assert/strict'
import { test } from 'node:test'
import { checkBotId } from 'botid/server'
import type { H3Event } from 'h3'
import { assertOferteoHuman, isOferteoApiPath } from '../server/utils/oferteoBotId.ts'

const event = { node: { req: { headers: { 'x-is-human': 'test-challenge', host: 'localhost' } } } } as H3Event

test('all demo API paths are guarded, including encoded names; other pages stay outside', () => {
  for (const path of ['/api/oferto', '/api/oferto/status', '/api/oferto/chat', '/api/oferto/future/action', '/api/%6fferto/chat', '/api/oferto%2fchat']) {
    assert.equal(isOferteoApiPath(path), true, path)
  }
  for (const path of ['/oferto/demo', '/oferteo/demo', '/api/cv/general.pdf', '/api/ofertox/chat', '/api/oferto%ZZ']) {
    assert.equal(isOferteoApiPath(path), false, path)
  }
})

test('verified humans pass and use matching Basic mode plus request headers', async () => {
  await assertOferteoHuman(event, async options => {
    assert.equal(options?.advancedOptions?.checkLevel, 'basic')
    assert.deepEqual(options?.advancedOptions?.headers, event.node.req.headers)
    assert.equal(options?.developmentOptions, undefined)
    return { isHuman: true, isBot: false, isVerifiedBot: false, bypassed: false }
  })
})

test('bot and unverified verdicts stop the request with 403', async () => {
  for (const isBot of [true, false]) {
    await assert.rejects(assertOferteoHuman(event, async () => ({
      isHuman: false, isBot, isVerifiedBot: false, bypassed: false,
    })), { statusCode: 403 })
  }
})

test('verification failures fail closed without disclosing provider errors', async () => {
  await assert.rejects(assertOferteoHuman(event, async () => { throw new Error('private-provider-details') }), error => {
    assert.equal((error as { statusCode: number }).statusCode, 503)
    assert.doesNotMatch(String(error), /private-provider-details/)
    return true
  })
})

test('real SDK development simulations allow HUMAN and reject BAD-BOT', async () => {
  const simulate = (bypass: 'HUMAN' | 'BAD-BOT'): typeof checkBotId => options => checkBotId({
    ...options,
    developmentOptions: { isDevelopment: true, bypass },
  })
  await assertOferteoHuman(event, simulate('HUMAN'))
  await assert.rejects(assertOferteoHuman(event, simulate('BAD-BOT')), { statusCode: 403 })
})
