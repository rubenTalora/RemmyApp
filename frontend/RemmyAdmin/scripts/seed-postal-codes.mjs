/**
 * Seed postal codes for Spain from Geonames dataset.
 *
 * Usage:
 *   node scripts/seed-postal-codes.mjs
 *
 * Requirements:
 *   - curl and unzip installed (standard on Linux/Mac)
 *   - SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// ─── Load env ────────────────────────────────────────────────────────────────

const envContent = readFileSync('.env.local', 'utf-8')
const getEnv = (key) => envContent.match(new RegExp(`^${key}=(.+)`, 'm'))?.[1]?.trim()

const supabaseUrl    = getEnv('VITE_SUPABASE_URL')
const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY')

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌  Add SUPABASE_SERVICE_ROLE_KEY to .env.local')
  console.error('   Get it from: Supabase Dashboard → Project Settings → API → service_role')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

// ─── Download + extract ───────────────────────────────────────────────────────

const tmpZip = join(tmpdir(), 'geonames_ES.zip')
const tmpTxt = join(tmpdir(), 'geonames_ES.txt')

if (!existsSync(tmpTxt)) {
  console.log('📥  Downloading Geonames ES dataset...')
  execSync(`curl -L "https://download.geonames.org/export/zip/ES.zip" -o "${tmpZip}" --silent --show-error`)
  execSync(`unzip -p "${tmpZip}" ES.txt > "${tmpTxt}"`)
  console.log('✅  Downloaded and extracted.\n')
} else {
  console.log(`♻️  Using cached file: ${tmpTxt}\n`)
}

// ─── Parse ────────────────────────────────────────────────────────────────────

const lines = readFileSync(tmpTxt, 'utf-8')
  .split('\n')
  .filter(l => l.startsWith('ES\t'))

console.log(`📊  Parsing ${lines.length} rows...`)

// Maps to deduplicate and preserve insertion order
const communityNames = new Set()
// provinceName -> communityName
const provinceMap    = new Map()
// `${provinceName}||${cityName}` -> provinceName
const cityMap        = new Map()
// `${postalCode}||${cityKey}` -> true (dedup)
const postalCodeSet  = new Set()
const postalCodeRows = []

for (const line of lines) {
  const cols = line.split('\t')
  if (cols.length < 8) continue

  const postalCode    = cols[1]?.trim().padStart(5, '0')
  const placeName     = cols[2]?.trim()
  const communityName = cols[3]?.trim()
  const provinceName  = cols[5]?.trim()

  if (!postalCode || !placeName || !communityName || !provinceName) continue

  communityNames.add(communityName)

  if (!provinceMap.has(provinceName))
    provinceMap.set(provinceName, communityName)

  const cityKey = `${provinceName}||${placeName}`
  if (!cityMap.has(cityKey))
    cityMap.set(cityKey, provinceName)

  const pcKey = `${postalCode}||${cityKey}`
  if (!postalCodeSet.has(pcKey)) {
    postalCodeSet.add(pcKey)
    postalCodeRows.push({ postalCode, cityKey })
  }
}

console.log(`   ${communityNames.size} comunidades`)
console.log(`   ${provinceMap.size} provincias`)
console.log(`   ${cityMap.size} municipios`)
console.log(`   ${postalCodeRows.length} códigos postales únicos\n`)

// ─── Batch insert helper ──────────────────────────────────────────────────────

async function batchUpsert(table, rows, batchSize = 500) {
  let done = 0
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize)
    const { error } = await supabase.from(table).upsert(batch, { onConflict: 'id' })
    if (error) throw new Error(`${table}: ${error.message}`)
    done += batch.length
    process.stdout.write(`\r   ${table}: ${done}/${rows.length}`)
  }
  console.log(`\r✅  ${table}: ${rows.length} rows inserted`)
}

// ─── 1. COMMUNITIES ───────────────────────────────────────────────────────────

console.log('🗺️   Inserting communities...')
const { error: delCommErr } = await supabase.from('COMMUNITIES').delete().neq('id', 0)
if (delCommErr) throw delCommErr

const commInsert  = [...communityNames].map(name => ({ name }))
const { data: commData, error: commErr } = await supabase
  .from('COMMUNITIES')
  .insert(commInsert)
  .select('id, name')
if (commErr) throw commErr

// name -> id
const communityIdMap = new Map(commData.map(c => [c.name, c.id]))
console.log(`✅  COMMUNITIES: ${commData.length} rows inserted`)

// ─── 2. PROVINCES ─────────────────────────────────────────────────────────────

console.log('\n🏙️   Inserting provinces...')
const provInsert = [...provinceMap.entries()].map(([name, communityName]) => ({
  name,
  id_community: communityIdMap.get(communityName),
}))

const { data: provData, error: provErr } = await supabase
  .from('PROVINCES')
  .insert(provInsert)
  .select('id, name')
if (provErr) throw provErr

const provinceIdMap = new Map(provData.map(p => [p.name, p.id]))
console.log(`✅  PROVINCES: ${provData.length} rows inserted`)

// ─── 3. CITIES ───────────────────────────────────────────────────────────────

console.log('\n🏘️   Inserting cities...')
const cityInsert = [...cityMap.entries()].map(([cityKey, provinceName]) => {
  const cityName = cityKey.split('||')[1]
  return {
    name: cityName,
    id_province: provinceIdMap.get(provinceName),
  }
})

const { data: cityData, error: cityErr } = await supabase
  .from('CITIES')
  .insert(cityInsert)
  .select('id, name, id_province')
if (cityErr) throw cityErr

// `${provinceName}||${cityName}` -> id
const cityIdMap = new Map(
  cityData.map(c => {
    const provinceName = [...provinceIdMap.entries()].find(([, id]) => id === c.id_province)?.[0]
    return [`${provinceName}||${c.name}`, c.id]
  })
)
console.log(`✅  CITIES: ${cityData.length} rows inserted`)

// ─── 4. POSTAL_CODES ─────────────────────────────────────────────────────────

console.log('\n📮  Inserting postal codes...')
const pcInsert = postalCodeRows.map(({ postalCode, cityKey }) => ({
  code:    postalCode,
  id_city: cityIdMap.get(cityKey),
})).filter(r => r.id_city != null)

console.log(`   (${postalCodeRows.length - pcInsert.length} skipped — city ID not resolved)`)
await batchUpsert('POSTAL_CODES', pcInsert)

// ─── 5. Refresh materialized view ────────────────────────────────────────────

console.log('\n🔄  Refreshing postal_code_lookup view...')
const { error: refreshErr } = await supabase.rpc('refresh_postal_code_lookup')
if (refreshErr) {
  // If the RPC doesn't exist yet, log a warning — it'll be refreshed via MCP
  console.warn('   ⚠️  refresh_postal_code_lookup RPC not found. Refresh manually.')
} else {
  console.log('✅  View refreshed.')
}

console.log('\n🎉  Seed complete!')
