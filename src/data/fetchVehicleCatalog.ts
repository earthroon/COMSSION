import type { VehicleCatalog } from '@/types/vehicle'

export function withBaseUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}

export async function fetchVehicleCatalog(
  dataPath = 'data/vehicle-catalog.json',
): Promise<VehicleCatalog> {
  const response = await fetch(withBaseUrl(dataPath), { cache: 'no-cache' })

  if (!response.ok) {
    throw new Error('Vehicle catalog data could not be loaded.')
  }

  return response.json() as Promise<VehicleCatalog>
}
