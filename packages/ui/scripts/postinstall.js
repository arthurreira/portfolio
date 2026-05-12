import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const PKG_DIR = resolve(__dirname, '..')
const TOKENS_PATH = join(PKG_DIR, 'dist', 'tokens.css')
const MARKER_START = '/* @arthurreira/ui:tokens:start */'
const MARKER_END = '/* @arthurreira/ui:tokens:end */'
const CANDIDATE_PATHS = [
  'app/globals.css',
  'src/app/globals.css',
  'src/globals.css',
  'styles/globals.css',
]

try {
  const cwd = process.env.INIT_CWD

  // Skip when running inside the package itself or at a workspace root
  if (!cwd) process.exit(0)
  if (resolve(cwd) === PKG_DIR) process.exit(0)
  if (existsSync(join(cwd, 'pnpm-workspace.yaml'))) process.exit(0)

  if (!existsSync(TOKENS_PATH)) {
    console.warn('[arthurreira/ui] dist/tokens.css not found — skipping token injection.')
    process.exit(0)
  }

  const tokens = readFileSync(TOKENS_PATH, 'utf8').trim()
  const block = `${MARKER_START}\n${tokens}\n${MARKER_END}`

  // Find globals.css in common Next.js locations
  let targetPath = null
  for (const candidate of CANDIDATE_PATHS) {
    const full = join(cwd, candidate)
    if (existsSync(full)) { targetPath = full; break }
  }

  if (!targetPath) {
    const outPath = join(cwd, 'ui-tokens.css')
    writeFileSync(outPath, block + '\n', 'utf8')
    console.log('[arthurreira/ui] No globals.css found. Wrote ui-tokens.css to your project root.')
    console.log('[arthurreira/ui] Add to your CSS entry point:')
    console.log('[arthurreira/ui]   @import "./ui-tokens.css";')
    process.exit(0)
  }

  let content = readFileSync(targetPath, 'utf8')

  if (content.includes(MARKER_START)) {
    // Replace existing block between markers
    const start = content.indexOf(MARKER_START)
    const end = content.indexOf(MARKER_END) + MARKER_END.length
    content = content.slice(0, start) + block + content.slice(end)
    writeFileSync(targetPath, content, 'utf8')
    console.log(`[arthurreira/ui] Updated design tokens in ${targetPath}`)
  } else {
    // First install — inject after the last @import line
    const lines = content.split('\n')
    let lastImport = -1
    for (let i = 0; i < lines.length; i++) {
      if (/^\s*@import\s/.test(lines[i])) lastImport = i
    }
    if (lastImport >= 0) {
      lines.splice(lastImport + 1, 0, '', block, '')
    } else {
      lines.unshift(block, '')
    }
    writeFileSync(targetPath, lines.join('\n'), 'utf8')
    console.log(`[arthurreira/ui] Injected design tokens into ${targetPath}`)
  }
} catch (err) {
  console.warn('[arthurreira/ui] postinstall skipped:', err.message)
}
