import { api } from './api'
import type { Weather } from '../types'

export async function getWeather(): Promise<Weather> {
  const response = await api.get<Weather>('/clima.json')
  return response.data
}
