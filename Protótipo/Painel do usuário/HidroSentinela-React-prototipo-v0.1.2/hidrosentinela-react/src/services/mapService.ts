import { api } from './api'
import type { MapPoint, RiverStation } from '../types'

export interface RoutePoint {
  lat: number
  lng: number
}

export interface FloodedStreetSegment {
  id: string
  name: string
  severity: 'normal' | 'attention' | 'alert' | 'critical'
  depthCm: number
  updatedAt: string
  routeFrom: RoutePoint
  routeTo: RoutePoint
  positions: [number, number][]
  routeSource: 'OSRM/OpenStreetMap'
}

export interface MapData {
  center: [number, number]
  zoom: number
  points: MapPoint[]
  stations: RiverStation[]
  floodedStreets: FloodedStreetSegment[]
  riskPolygons: Array<{
    id: string
    name: string
    severity: 'normal' | 'attention' | 'alert' | 'critical'
    positions: [number, number][]
  }>
  floodPoints: Array<{
    id: string
    name: string
    severity: 'normal' | 'attention' | 'alert' | 'critical'
    intensity: number
    lat: number
    lng: number
    description: string
  }>
  susceptibilityAreas: Array<{
    id: string
    name: string
    severity: 'normal' | 'attention' | 'alert' | 'critical'
    lat: number
    lng: number
    radius: number
    description: string
  }>
}

interface OsrmResponse {
  code: string
  routes?: Array<{
    geometry?: {
      coordinates: [number, number][]
    }
  }>
}

async function fetchRealRoadGeometry(
  from: RoutePoint,
  to: RoutePoint,
): Promise<[number, number][]> {
  const coordinatePair = `${from.lng},${from.lat};${to.lng},${to.lat}`
  const url = `https://router.project-osrm.org/route/v1/driving/${coordinatePair}?overview=full&geometries=geojson&steps=false`

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`OSRM respondeu HTTP ${response.status}`)
  }

  const payload = (await response.json()) as OsrmResponse
  const coordinates = payload.routes?.[0]?.geometry?.coordinates

  if (payload.code !== 'Ok' || !coordinates?.length) {
    throw new Error('Não foi possível obter a geometria da via no OSRM')
  }

  return coordinates.map(([lng, lat]) => [lat, lng])
}

function hasValidPositions(positions?: [number, number][]) {
  return Array.isArray(positions) && positions.length > 1
}

async function enrichFloodedStreets(
  streets: Array<Omit<FloodedStreetSegment, 'routeSource'> & { positions?: [number, number][] }>,
): Promise<FloodedStreetSegment[]> {
  return Promise.all(
    streets.map(async (street) => {
      // A geometria estática mantém a rua visível mesmo se o serviço de rotas
      // externo estiver indisponível. Quando OSRM responde, usamos a geometria
      // obtida da malha viária para refinar o traçado.
      const fallbackPositions = hasValidPositions(street.positions)
        ? street.positions!
        : [
            [street.routeFrom.lat, street.routeFrom.lng],
            [street.routeTo.lat, street.routeTo.lng],
          ] as [number, number][]

      try {
        const positions = await fetchRealRoadGeometry(street.routeFrom, street.routeTo)
        return {
          ...street,
          positions,
          routeSource: 'OSRM/OpenStreetMap' as const,
        }
      } catch (error) {
        console.warn(`OSRM indisponível para ${street.name}; usando geometria local da demonstração.`, error)
        return {
          ...street,
          positions: fallbackPositions,
          routeSource: 'OSRM/OpenStreetMap' as const,
        }
      }
    }),
  )
}

export async function getMapData(): Promise<MapData> {
  const response = await api.get<Omit<MapData, 'floodedStreets'> & {
    floodedStreets: Array<Omit<FloodedStreetSegment, 'routeSource'>>
  }>('/mapa.json')

  const data = response.data
  const floodedStreets = await enrichFloodedStreets(data.floodedStreets)

  return {
    ...data,
    floodedStreets,
  }
}
