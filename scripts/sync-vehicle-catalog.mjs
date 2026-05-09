import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const catalogPath = path.join(root, 'public', 'data', 'vehicle-catalog.json')
const errorsPath = path.join(root, 'public', 'data', 'vehicle-catalog.errors.json')
const REQUIRED_SHEETS = ['Vehicles_Public', 'VehicleImages_Public', 'VehicleVideos_Public']

function requireEnv(name) {
  const value = process.env[name]
  return value && value.trim().length > 0 ? value : ''
}

function normalizeKey(key) {
  return String(key ?? '').trim()
}

function toRows(values) {
  const [headers = [], ...rows] = values ?? []
  return rows.map((row, rowIndex) => {
    const item = { __row: rowIndex + 2 }
    headers.forEach((header, index) => {
      item[normalizeKey(header)] = String(row[index] ?? '').trim()
    })
    return item
  })
}

function toInt(value, fallback = undefined) {
  if (value === '' || value === undefined || value === null) return fallback
  const parsed = Number(String(value).replaceAll(',', ''))
  return Number.isFinite(parsed) ? Math.trunc(parsed) : Number.NaN
}

function normalizeStatus(value) {
  const trimmed = String(value ?? '').trim()
  const aliases = {
    available: 'available',
    reserved: 'reserved',
    sold: 'sold',
    hidden: 'hidden',
    sale: 'available',
    visible: 'available',
  }
  return aliases[trimmed] ?? trimmed
}

function extractYoutubeId(row) {
  if (row.youtube_id) return row.youtube_id
  const url = row.youtube_url
  if (!url) return ''
  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) return match[1]
  }
  return ''
}

function error(sheet, row, field, value, message) {
  return { level: 'error', sheet, row, field, value: String(value ?? ''), message }
}

async function writeReport(errors) {
  const report = {
    schemaVersion: '1.0.0',
    generatedAt: new Date().toISOString(),
    hasBlockingErrors: errors.length > 0,
    errors,
  }
  await mkdir(path.dirname(errorsPath), { recursive: true })
  await writeFile(errorsPath, JSON.stringify(report, null, 2), 'utf8')
}

async function readExistingOrExit() {
  if (process.env.REQUIRE_GOOGLE_SHEET === '1') {
    console.error('[sync] Google Sheet secrets are required, but missing.')
    process.exit(1)
  }

  try {
    await readFile(catalogPath, 'utf8')
    await writeReport([])
    console.log('[sync] Google Sheet env missing. Kept existing sample catalog.')
  } catch {
    console.error('[sync] Google Sheet env missing and no sample catalog exists.')
    process.exit(1)
  }
}

const spreadsheetId = requireEnv('GOOGLE_SHEET_ID')
const clientEmail = requireEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL')
const rawPrivateKey = requireEnv('GOOGLE_PRIVATE_KEY')

if (!spreadsheetId || !clientEmail || !rawPrivateKey) {
  await readExistingOrExit()
  process.exit(0)
}

const privateKey = rawPrivateKey.replace(/\\n/g, '\n')
const { google } = await import('googleapis')
const auth = new google.auth.JWT({
  email: clientEmail,
  key: privateKey,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})
const sheets = google.sheets({ version: 'v4', auth })

async function readSheet(range) {
  const response = await sheets.spreadsheets.values.get({ spreadsheetId, range })
  return toRows(response.data.values ?? [])
}

const [vehicleRows, imageRows, videoRows] = await Promise.all(REQUIRED_SHEETS.map((sheet) => readSheet(sheet)))
const errors = []
const vehicleIds = new Set()

for (const row of vehicleRows) {
  if (!row.vehicle_id) errors.push(error('Vehicles_Public', row.__row, 'vehicle_id', row.vehicle_id, 'vehicle_id is required.'))
  if (vehicleIds.has(row.vehicle_id)) errors.push(error('Vehicles_Public', row.__row, 'vehicle_id', row.vehicle_id, 'vehicle_id must be unique.'))
  vehicleIds.add(row.vehicle_id)
}

for (const row of imageRows) {
  if (!vehicleIds.has(row.vehicle_id)) errors.push(error('VehicleImages_Public', row.__row, 'vehicle_id', row.vehicle_id, 'vehicle_id does not exist in Vehicles_Public.'))
}

for (const row of videoRows) {
  if (!vehicleIds.has(row.vehicle_id)) errors.push(error('VehicleVideos_Public', row.__row, 'vehicle_id', row.vehicle_id, 'vehicle_id does not exist in Vehicles_Public.'))
  if (!extractYoutubeId(row)) errors.push(error('VehicleVideos_Public', row.__row, 'youtube_id', row.youtube_url || row.youtube_id, 'youtube id could not be resolved.'))
}

const imagesByVehicle = new Map()
for (const row of imageRows) {
  const list = imagesByVehicle.get(row.vehicle_id) ?? []
  list.push({
    id: row.image_id,
    kind: row.kind,
    src: row.src,
    alt: row.alt,
    sortOrder: toInt(row.sort_order, list.length + 1),
  })
  imagesByVehicle.set(row.vehicle_id, list)
}

const videosByVehicle = new Map()
for (const row of videoRows) {
  const youtubeId = extractYoutubeId(row)
  if (youtubeId) videosByVehicle.set(row.vehicle_id, { youtubeId, title: row.title || 'Vehicle video' })
}

const vehicles = vehicleRows.map((row, index) => {
  const images = imagesByVehicle.get(row.vehicle_id) ?? []
  const thumbnails = images.filter((image) => image.kind === 'thumbnail')
  if (thumbnails.length !== 1) errors.push(error('VehicleImages_Public', row.__row, 'kind', thumbnails.length, 'exactly one thumbnail is required.'))

  return {
    id: row.vehicle_id,
    status: normalizeStatus(row.status),
    title: row.title,
    sortOrder: toInt(row.sort_order, index + 1),
    thumbnail: thumbnails[0]?.src ?? '',
    profile: {
      vehicleType: row.vehicle_type,
      brand: row.brand,
      model: row.model,
      year: toInt(row.year),
      mileageKm: toInt(row.mileage_km),
      fuel: row.fuel || undefined,
      transmission: row.transmission || undefined,
      color: row.color || undefined,
      shortDescription: row.short_desc,
      detailDescription: row.detail_desc,
    },
    images,
    video: videosByVehicle.get(row.vehicle_id),
    contact: row.phone_raw
      ? {
          label: row.phone_label || 'Contact',
          phoneDisplay: row.phone_display || row.phone_raw,
          phoneRaw: row.phone_raw.replace(/[^0-9]/g, ''),
        }
      : undefined,
  }
})

await writeReport(errors)
if (errors.length > 0) {
  console.error(`[sync] ${errors.length} blocking error(s). See public/data/vehicle-catalog.errors.json`)
  process.exit(1)
}

const catalog = {
  schemaVersion: '1.0.0',
  generatedAt: new Date().toISOString(),
  vehicles,
}

await mkdir(path.dirname(catalogPath), { recursive: true })
await writeFile(catalogPath, JSON.stringify(catalog, null, 2), 'utf8')
console.log(`[sync] wrote ${vehicles.length} vehicle(s) to public/data/vehicle-catalog.json`)
