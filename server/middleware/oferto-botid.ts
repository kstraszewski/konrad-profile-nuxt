import { defineEventHandler, getRequestURL, setHeader } from 'h3'
import { assertOferteoHuman, isOferteoApiPath } from '../utils/oferteoBotId'

export default defineEventHandler(async (event) => {
  if (!isOferteoApiPath(getRequestURL(event).pathname)) return
  setHeader(event, 'Cache-Control', 'no-store')
  // Covers every demo API method, including status, before any handler runs.
  await assertOferteoHuman(event)
})
