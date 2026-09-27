import { readFile } from 'node:fs/promises'
import { neon } from '@neondatabase/serverless'

// Explicitly opt in to this demo URL: never use a generic DATABASE_URL.
const databaseUrl = process.env.OFERTEO_DATABASE_DIRECT_URL || process.env.NUXT_OFERTEO_DATABASE_URL
if (!databaseUrl) throw new Error('Set OFERTEO_DATABASE_DIRECT_URL or NUXT_OFERTEO_DATABASE_URL for the isolated oferteo_demo database.')
const sql = neon(databaseUrl, { fetchOptions: { signal: AbortSignal.timeout(30_000) } })
const [database] = await sql`SELECT current_database() AS name`
if (database?.name !== 'oferteo_demo') throw new Error('Refusing to seed a database other than oferteo_demo.')

const schema = await readFile(new URL('./oferto-schema.sql', import.meta.url), 'utf8')
const catalog = JSON.parse(await readFile(new URL('../shared/data/oferteo-contractors.json', import.meta.url), 'utf8'))
if (!Array.isArray(catalog) || catalog.length < 1 || new Set(catalog.map(profile => profile.id)).size !== catalog.length) {
  throw new Error('Invalid or duplicate source records.')
}
for (const profile of catalog) {
  if (!profile.id || !profile.name || !profile.city || !profile.category || !Array.isArray(profile.services)
      || !profile.sourceUrl?.startsWith('https://www.oferteo.pl/') || !profile.retrievedAt) {
    throw new Error('A source record is incomplete.')
  }
}
// Parameterized DML and fixed, repository-owned DDL. Upserts make repeated seeds safe.
const statements = schema.split(';').map(statement => statement.trim()).filter(Boolean)
await sql.transaction(statements.map(statement => sql.query(statement)))
await sql.transaction(catalog.map(profile => sql`
  INSERT INTO oferteo_contractors (id, name, city, category, profile)
  VALUES (${profile.id}, ${profile.name}, ${profile.city}, ${profile.category}, ${JSON.stringify(profile)}::jsonb)
  ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, city = EXCLUDED.city,
    category = EXCLUDED.category, profile = EXCLUDED.profile, updated_at = now()
`))
const [result] = await sql`SELECT count(*)::integer AS count FROM oferteo_contractors`
console.log(`Oferteo demo seeded: ${result.count} source profiles in oferteo_demo. No chat contents stored.`)
