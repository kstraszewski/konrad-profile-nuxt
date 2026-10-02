import { neon } from '@neondatabase/serverless'
import { createError } from 'h3'
import { z } from 'zod'
import snapshot from '../../shared/data/oferteo-contractors.json'
import type { OferteoContractor } from '../../shared/types/oferteo'

const contractorSchema = z.object({
  id: z.string(), name: z.string(), city: z.string(), district: z.string().nullable(), category: z.string(),
  services: z.array(z.string()), description: z.string(), rating: z.number().min(0).max(5).nullable(),
  reviewCount: z.number().int().nonnegative().nullable(),
  sourceUrl: z.url().refine(value => new URL(value).hostname === 'www.oferteo.pl' && new URL(value).protocol === 'https:'),
  sourceLabel: z.string(), retrievedAt: z.string(), imageUrl: z.string().nullable(),
})

export function oferteoSql(databaseUrl: string) {
  return neon(databaseUrl, { fetchOptions: { signal: AbortSignal.timeout(8_000) } })
}

export async function getOferteoCatalog(databaseUrl: string): Promise<{ catalog: OferteoContractor[], source: 'neon' | 'snapshot' }> {
  if (!databaseUrl) return { catalog: z.array(contractorSchema).parse(snapshot), source: 'snapshot' }
  try {
    const sql = oferteoSql(databaseUrl)
    const rows = await sql`SELECT profile FROM oferteo_contractors ORDER BY id LIMIT 50`
    const catalog = z.array(contractorSchema).parse(rows.map(row => row.profile))
    if (catalog.length === 0) throw new Error('Empty demo catalog')
    return { catalog, source: 'neon' }
  } catch {
    // Never disguise a configured database failure as a healthy snapshot.
    throw createError({ statusCode: 503, statusMessage: 'Catalog unavailable', message: 'Katalog wykonawców jest chwilowo niedostępny. Spróbuj ponownie za chwilę.', data: { code: 'CATALOG_UNAVAILABLE', retryable: true } })
  }
}
