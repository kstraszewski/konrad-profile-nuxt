import { readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const lock = JSON.parse(await readFile(new URL('../skills-lock.json', import.meta.url), 'utf8'))
const requested = process.argv.slice(2)

for (const name of requested) {
  if (!Object.hasOwn(lock.skills, name)) throw new Error(`Unknown project skill: ${name}`)
}

// Re-add explicit selections: CLI 1.7.0's update command treats upstream
// skill symlinks as duplicate candidates and skips AI SDK and Neon.
const sources = new Map()
for (const [name, entry] of Object.entries(lock.skills)) {
  if (requested.length && !requested.includes(name)) continue
  let source
  if (entry.sourceType === 'github') source = entry.source
  else if (entry.sourceType === 'well-known' && entry.sourceUrl) source = entry.sourceUrl
  else throw new Error(`Unsupported source for ${name}: ${entry.sourceType}`)
  const names = sources.get(source) ?? []
  names.push(name)
  sources.set(source, names)
}

for (const [source, names] of sources) {
  console.log(`\nRefreshing ${names.join(', ')} from ${source}`)
  const result = spawnSync('npx', [
    '--yes', 'skills@1.7.0', 'add', source,
    '--skill', ...names,
    '--agent', 'codex', 'claude-code', '--yes',
  ], { cwd: root, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) {
    console.error(`Skill refresh failed for ${source}`)
    process.exit(result.status ?? 1)
  }
}

console.log('\nProject skills refreshed. Review the skill files and skills-lock.json together.')
