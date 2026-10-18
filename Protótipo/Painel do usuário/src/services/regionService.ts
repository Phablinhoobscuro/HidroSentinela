import { api } from './api'
import type { Region } from '../types'

export async function getRegion(): Promise<Region> {
  const response = await api.get<Region>('/regiao.json')
  return response.data
}
