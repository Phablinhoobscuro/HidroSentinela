import { api } from './api'
import type { NewsItem } from '../types'

export async function getNews(): Promise<NewsItem[]> {
  const response = await api.get<NewsItem[]>('/noticias.json')
  return response.data
}
