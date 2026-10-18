import { useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import { AlertCard } from '../components/AlertCard'
import { Card } from '../components/Card'
import { ErrorState } from '../components/ErrorState'
import { Loading } from '../components/Loading'
import { MapView } from '../components/MapView'
import { SectionHeader } from '../components/SectionHeader'
import { getAlerts } from '../services/alertsService'
import { getMapData } from '../services/mapService'
import { getRegion } from '../services/regionService'
import { getWeather } from '../services/weatherService'
import { useAsyncData } from '../hooks/useAsyncData'

export function Dashboard() {
  const loadRegion = useCallback(() => getRegion(), [])
  const loadWeather = useCallback(() => getWeather(), [])
  const loadAlerts = useCallback(() => getAlerts(), [])
  const loadMap = useCallback(() => getMapData(), [])

  const region = useAsyncData(loadRegion)
  const weather = useAsyncData(loadWeather)
  const alerts = useAsyncData(loadAlerts)
  const map = useAsyncData(loadMap)

  const activeAlert = useMemo(() => alerts.data?.find((item) => item.active), [alerts.data])

  if (region.loading || weather.loading || alerts.loading || map.loading) return <Loading />
  if (region.error) return <ErrorState message={region.error.message} onRetry={() => void region.reload()} />

  const retryAll = () => {
    void region.reload(); void weather.reload(); void alerts.reload(); void map.reload()
    toast.info('Atualizando dados demonstrativos...')
  }

  return (
    <div className="page">
      <header className="page-header welcome-header">
        <div>
          <p className="eyebrow">Área do morador</p>
          <h1>Bem-vindo, João!</h1>
          <p>Acompanhe a situação da sua região em tempo real.</p>
        </div>
        {activeAlert && (
          <div className="top-alert">
            <div className="top-alert-icon">!</div>
            <div><strong>Alerta ativo na sua região</strong><span>{activeAlert.title}. Fique atento!</span></div>
            <button onClick={() => toast.info('Detalhes demonstrativos do alerta selecionado.')}>›</button>
          </div>
        )}
      </header>

      <div className="grid-cards">
        <Card title="Nível do Rio" value={`${region.data!.riverLevel.toFixed(1).replace('.', ',')} m`} detail={<span className="rise">↗ +{region.data!.riverVariation.toFixed(1).replace('.', ',')} m nas últimas 3h</span>} icon="⌁" tone="tone-blue" />
        <Card title="Situação Atual" value={region.data!.situationLabel} detail={region.data!.situationMessage} icon="!" tone="tone-red" />
        <Card title="Previsão (24h)" value="Chuva forte" detail={`${weather.data?.probability ?? 80}% de probabilidade`} icon="☔" tone="tone-cloud" />
        <Card title="Sua Região" value={region.data!.name} detail={`${region.data!.city} · ${region.data!.state}`} icon="⌖" tone="tone-region" />
      </div>

      <section className="section-block">
        <SectionHeader title="Mapa da Sua Região" action={<button className="link-button" onClick={() => toast.info('Use o menu Mapa para explorar a região.')}>Ver mapa completo</button>} />
        {map.error ? <ErrorState message={map.error.message} onRetry={() => void map.reload()} /> : <MapView data={map.data!} compact />}
      </section>

      <section className="section-block two-column">
        <div>
          <SectionHeader title="Últimos Alertas" action={<button className="link-button" onClick={() => toast.info('Use o menu Alertas para ver todos.')}>Ver todos</button>} />
          <div className="list-stack">{alerts.data?.slice(0, 3).map((item) => <AlertCard key={item.id} alert={item} compact />)}</div>
        </div>
        <div className="info-notice-card">
          <div className="mini-icon">i</div>
          <div>
            <strong>Dados simulados para demonstração</strong>
            <p>O protótipo usa dados fictícios para representar a região de São Torquato, Paul e proximidades.</p>
          </div>
          <button className="link-button" onClick={retryAll}>Atualizar</button>
        </div>
      </section>
    </div>
  )
}
