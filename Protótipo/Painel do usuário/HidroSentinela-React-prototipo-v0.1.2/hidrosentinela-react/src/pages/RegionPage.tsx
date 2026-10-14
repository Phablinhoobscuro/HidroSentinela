import { useCallback } from 'react'
import { ErrorState } from '../components/ErrorState'
import { Loading } from '../components/Loading'
import { RiverChart } from '../components/RiverChart'
import { SectionHeader } from '../components/SectionHeader'
import { StatusBadge } from '../components/StatusBadge'
import { useAsyncData } from '../hooks/useAsyncData'
import { getRegion } from '../services/regionService'
import { getWeather } from '../services/weatherService'

const hours = ['06h', '09h', '12h', '15h', '18h', '21h', '00h']
const values = [2.1, 2.2, 2.45, 2.7, 2.9, 3.05, 3.2]

export function RegionPage() {
  const loadRegion = useCallback(() => getRegion(), [])
  const loadWeather = useCallback(() => getWeather(), [])
  const region = useAsyncData(loadRegion)
  const weather = useAsyncData(loadWeather)

  if (region.loading || weather.loading) return <Loading />
  if (region.error || weather.error) return <ErrorState message={(region.error ?? weather.error)!.message} onRetry={() => { void region.reload(); void weather.reload() }} />

  return (
    <div className="page">
      <header className="page-header region-title"><div><p className="eyebrow">Informações locais</p><h1>Minha Região</h1><p>São Torquato – Vila Velha/ES</p></div><select defaultValue="sao-torquato"><option value="sao-torquato">São Torquato</option></select></header>
      <section className="region-hero">
        <div className="region-photo" />
        <div className="region-situation"><span>Situação atual</span><h2>{region.data!.situationLabel}</h2><p>{region.data!.situationMessage}</p><StatusBadge severity={region.data!.situation} /></div>
      </section>
      <div className="region-grid-two">
        <section className="section-block"><SectionHeader title="Nível do Rio" description="Evolução demonstrativa do nível monitorado." /><div className="metric-line"><strong>{region.data!.riverLevel.toFixed(1).replace('.', ',')} m</strong><span>↗ +{region.data!.riverVariation.toFixed(1).replace('.', ',')} m nas últimas 3h</span></div><RiverChart values={values} labels={hours} /></section>
        <section className="section-block weather-panel"><SectionHeader title="Previsão do Tempo" /><div className="weather-main"><div className="weather-symbol">☔</div><div><strong>Chuva forte</strong><span>{weather.data!.probability}% de probabilidade</span></div></div><div className="weather-data"><div><span>Temperatura</span><strong>{weather.data!.temperature}°C</strong></div><div><span>Vento</span><strong>{weather.data!.wind} km/h</strong></div></div></section>
      </div>
      <div className="region-grid-two">
        <section className="section-block"><SectionHeader title="Áreas de Risco" /><div className="risk-list">{region.data!.riskAreas.map((area) => <div className="risk-row" key={area.id}><div><strong>{area.name}</strong><span>{area.description}</span></div><StatusBadge severity={area.severity} /></div>)}</div></section>
        <section className="section-block"><SectionHeader title="Orientações para Moradores" /><div className="guidance-list">{region.data!.guidance.map((item) => <div key={item}><span>i</span><p>{item}</p></div>)}</div></section>
      </div>
    </div>
  )
}
