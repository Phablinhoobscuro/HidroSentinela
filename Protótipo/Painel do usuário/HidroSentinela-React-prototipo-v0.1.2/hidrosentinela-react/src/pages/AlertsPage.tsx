import { useCallback, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { AlertCard } from '../components/AlertCard'
import { ErrorState } from '../components/ErrorState'
import { Loading } from '../components/Loading'
import { SectionHeader } from '../components/SectionHeader'
import { useAsyncData } from '../hooks/useAsyncData'
import { getAlerts } from '../services/alertsService'
import type { AlertFilter } from '../types'

export function AlertsPage() {
  const loadAlerts = useCallback(() => getAlerts(), [])
  const alerts = useAsyncData(loadAlerts)
  const [filter, setFilter] = useState<AlertFilter>('all')

  const filtered = useMemo(() => {
    if (!alerts.data) return []
    if (filter === 'active') return alerts.data.filter((item) => item.active)
    if (filter === 'informative') return alerts.data.filter((item) => !item.active)
    return alerts.data
  }, [alerts.data, filter])

  if (alerts.loading) return <Loading />
  if (alerts.error) return <ErrorState message={alerts.error.message} onRetry={() => void alerts.reload()} />

  return (
    <div className="page">
      <header className="page-header"><div><p className="eyebrow">Avisos</p><h1>Alertas</h1><p>Acompanhe os alertas e avisos da sua região.</p></div></header>
      <section className="section-block">
        <SectionHeader title="Alertas da região" />
        <div className="filter-tabs">
          {([['all', 'Todos'], ['active', 'Ativos'], ['informative', 'Informativos']] as const).map(([value, label]) => (
            <button key={value} className={filter === value ? 'active' : ''} onClick={() => { setFilter(value); toast.info(`Filtro: ${label}`) }}>{label}</button>
          ))}
        </div>
        <div className="list-stack large">{filtered.map((item) => <AlertCard key={item.id} alert={item} />)}</div>
      </section>
    </div>
  )
}
