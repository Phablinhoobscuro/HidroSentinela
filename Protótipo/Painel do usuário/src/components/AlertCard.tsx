import type { Alert } from '../types'
import { StatusBadge } from './StatusBadge'

const icons: Record<Alert['type'], string> = {
  river: '↗',
  rain: '☔',
  flood: '⚠',
  traffic: '⌁',
  normal: '✓',
}

export function AlertCard({ alert, compact = false }: { alert: Alert; compact?: boolean }) {
  return (
    <article className={`alert-card ${compact ? 'compact' : ''}`}>
      <div className={`alert-icon alert-${alert.severity}`}>{icons[alert.type]}</div>
      <div className="alert-card-content">
        <div className="alert-card-row">
          <div>
            <h3>{alert.title}</h3>
            <p>{alert.description}</p>
          </div>
          <span className="alert-time">{alert.time}</span>
        </div>
        <div className="alert-meta">
          <StatusBadge severity={alert.severity} />
          {alert.active ? <span className="muted">Alerta ativo</span> : <span className="muted">Informativo</span>}
        </div>
      </div>
      <span className="chevron">›</span>
    </article>
  )
}
