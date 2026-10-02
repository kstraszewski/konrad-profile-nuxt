import assert from 'node:assert/strict'
import { test } from 'node:test'
import { checkBotId } from 'botid/server'
import type { H3Event } from 'h3'
import { assertOferteoHuman, isOferteoApiPath } from '../server/utils/oferteoBotId.ts'

const event = { node: { req: { headers: { 'x-is-human': 'test-challenge', host: 'localhost' } } } } as H3Event

test('all demo API paths are guarded, including encoded names; other pages stay outside', () => {
  for (const path of ['/api/oferto', '/api/oferto/status', '/api/oferto/chat', '/api/oferto/offer', '/api/oferto/realtime', '/api/oferto/future/action', '/api/%6fferto/chat', '/api/oferto%2fchat']) {
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
    assert.deepEqual(options?.developmentOptions, { isDevelopment: true })
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

test('contradictory and malformed verdicts cannot pass human verification', async () => {
  for (const verdict of [
    { isHuman: true, isBot: true, isVerifiedBot: false, bypassed: false },
    { isHuman: true, isVerifiedBot: false, bypassed: false },
    { isHuman: 'true', isBot: false, isVerifiedBot: false, bypassed: false },
  ]) {
    await assert.rejects(assertOferteoHuman(event, async () => verdict as Awaited<ReturnType<typeof checkBotId>>), { statusCode: 403 })
  }
})

test('production and Vercel previews require a challenge, disable simulation and refuse bypass verdicts', async () => {
  const previous = { NODE_ENV: process.env.NODE_ENV, VERCEL: process.env.VERCEL, VERCEL_ENV: process.env.VERCEL_ENV }
  try {
    for (const environment of [
      { NODE_ENV: 'production', VERCEL: undefined, VERCEL_ENV: undefined },
      { NODE_ENV: 'development', VERCEL: '1', VERCEL_ENV: 'preview' },
      { NODE_ENV: 'development', VERCEL: undefined, VERCEL_ENV: 'production' },
      { NODE_ENV: undefined, VERCEL: undefined, VERCEL_ENV: undefined },
    ]) {
      for (const [key, value] of Object.entries(environment)) {
        if (value === undefined) delete process.env[key]
        else process.env[key] = value
      }
      let verified = false
      const missingChallenge = { node: { req: { headers: { host: 'localhost' } } } } as H3Event
      await assert.rejects(assertOferteoHuman(missingChallenge, async () => {
        verified = true
        return { isHuman: true, isBot: false, isVerifiedBot: false, bypassed: false }
      }), { statusCode: 403 })
      assert.equal(verified, false, 'missing browser proof is rejected before provider verification')
      await assertOferteoHuman(event, async options => {
        assert.deepEqual(options?.developmentOptions, { isDevelopment: false })
        return { isHuman: true, isBot: false, isVerifiedBot: false, bypassed: false }
      })
      await assert.rejects(assertOferteoHuman(event, async () => ({
        isHuman: true, isBot: false, isVerifiedBot: false, bypassed: true,
      })), { statusCode: 403 })
    }
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
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
