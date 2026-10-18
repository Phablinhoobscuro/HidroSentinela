import type { ReactNode } from 'react'

interface Props {
  title: string
  value?: ReactNode
  detail?: ReactNode
  icon?: ReactNode
  tone?: string
}

export function Card({ title, value, detail, icon, tone = '' }: Props) {
  return (
    <article className={`info-card ${tone}`}>
      <div className="info-card-top">
        <span>{title}</span>
        <span className="card-icon">{icon}</span>
      </div>
      {value && <strong className="info-card-value">{value}</strong>}
      {detail && <div className="info-card-detail">{detail}</div>}
    </article>
  )
}
