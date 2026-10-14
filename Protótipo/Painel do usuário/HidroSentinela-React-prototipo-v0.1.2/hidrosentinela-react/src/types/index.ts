export type Severity = 'normal' | 'attention' | 'alert' | 'critical'
export type AlertFilter = 'all' | 'active' | 'informative'

export interface Alert {
  id: string
  title: string
  description: string
  time: string
  severity: Severity
  active: boolean
  type: 'river' | 'rain' | 'flood' | 'traffic' | 'normal'
}

export interface RiskArea {
  id: string
  name: string
  severity: Severity
  description: string
  lat: number
  lng: number
}

export interface RiverStation {
  id: string
  name: string
  level: number
  variation: number
  trend: 'up' | 'down' | 'stable'
  status: Severity
  updatedAt: string
  lat: number
  lng: number
}

export interface Weather {
  rain: string
  temperature: number
  wind: number
  probability: number
}

export interface NewsItem {
  id: string
  title: string
  category: 'comunicados' | 'prevenção' | 'ações'
  date: string
  time: string
  summary: string
  image: string
}

export interface Region {
  name: string
  city: string
  state: string
  situation: Severity
  situationLabel: string
  situationMessage: string
  riverLevel: number
  riverVariation: number
  station: string
  riskAreas: RiskArea[]
  guidance: string[]
}

export interface MapPoint {
  id: string
  name: string
  kind: 'station' | 'shelter' | 'point'
  lat: number
  lng: number
  description: string
}

export interface User {
  name: string
  role: string
  region: string
}
