import { useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import { ErrorState } from '../components/ErrorState'
import { Loading } from '../components/Loading'
import { MapView } from '../components/MapView'
import { StatusBadge } from '../components/StatusBadge'
import { useAsyncData } from '../hooks/useAsyncData'
import { getMapData } from '../services/mapService'
import { getWeather } from '../services/weatherService'

type MapDashboardData = Awaited<ReturnType<typeof getMapData>> & {
  weather: Awaited<ReturnType<typeof getWeather>>
}

function MetricCard({
  icon,
  tone,
  label,
  value,
  detail,
}: {
  icon: string
  tone: 'rain' | 'alert'
  label: string
  value: string
  detail?: string
}) {
  return (
    <button
      type="button"
      className={`map-metric-card map-metric-${tone}`}
      onClick={() => toast.info(`${label}: ${value}${detail ? ` — ${detail}` : ''}`)}
    >
      <span className="map-metric-icon" aria-hidden="true">{icon}</span>
      <span className="map-metric-copy">
        <span className="map-metric-label">{label}</span>
        <strong>{value}</strong>
        {detail && <small>{detail}</small>}
      </span>
      <span className="map-metric-arrow" aria-hidden="true">›</span>
    </button>
  )
}

export function MapPage() {
  const loadMapDashboard = useCallback(async (): Promise<MapDashboardData> => {
    const [mapData, weather] = await Promise.all([getMapData(), getWeather()])
    return { ...mapData, weather }
  }, [])

  const dashboard = useAsyncData(loadMapDashboard)

  const summary = useMemo(() => {
    const data = dashboard.data
    if (!data) {
      return { floodPoints: 0, possibility: 'Indisponível', severity: 'attention' as const }
    }

    const critical = data.floodPoints.some((point) => point.severity === 'critical')
    const alert = data.floodPoints.some((point) => point.severity === 'alert') || data.floodedStreets.length > 0

    return {
      floodPoints: data.floodPoints.length,
      possibility: critical ? 'Alta' : alert ? 'Moderada' : 'Baixa',
      severity: critical ? 'critical' as const : alert ? 'alert' as const : 'normal' as const,
    }
  }, [dashboard.data])

  if (dashboard.loading) return <Loading label="Carregando monitoramento visual..." />
  if (dashboard.error) return <ErrorState message={dashboard.error.message} onRetry={() => void dashboard.reload()} />

  const data = dashboard.data!

  return (
    <div className="map-dashboard-page">
      <div className="map-dashboard-topbar">
        <div className="map-search">
          <span aria-hidden="true">⌕</span>
          <input
            aria-label="Buscar no mapa"
            placeholder="Buscar endereço, bairro ou ponto de referência..."
          />
        </div>

        <div className="map-location">
          <span className="map-location-icon" aria-hidden="true">⌖</span>
          <div>
            <strong>Vila Velha – ES</strong>
            <small>São Torquato e Paul</small>
          </div>
        </div>

        <div className="map-realtime">
          <span className="realtime-dot" />
          Tempo real
        </div>
      </div>

      <MapView data={data} />

      <aside className="map-info-rail" aria-label="Resumo do monitoramento">
        <div className="map-info-title">
          <div>
            <span>MONITORAMENTO</span>
            <strong>São Torquato</strong>
          </div>
          <StatusBadge severity={summary.severity} />
        </div>

        <div className="map-info-divider">Resumo da região</div>

        <MetricCard
          icon="☔"
          tone="rain"
          label="Previsão de chuva"
          value={`${data.weather.probability}%`}
          detail={data.weather.rain}
        />

        <MetricCard
          icon="!"
          tone="alert"
          label="Pontos de alagamento"
          value={`${summary.floodPoints}`}
          detail="pontos amostrais"
        />

        <MetricCard
          icon="⚠"
          tone="alert"
          label="Possibilidade de alagamento"
          value={summary.possibility}
          detail="situação da região"
        />
      </aside>
    </div>
  )
}
