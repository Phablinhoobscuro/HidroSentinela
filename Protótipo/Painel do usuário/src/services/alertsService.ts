import { api } from './api'
import type { Alert } from '../types'

export async function getAlerts(): Promise<Alert[]> {
  const response = await api.get<Alert[]>('/alertas.json')
  return response.data
}
