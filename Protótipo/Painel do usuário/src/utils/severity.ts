import type { Severity } from '../types'

export const severityLabel: Record<Severity, string> = {
  normal: 'Normal',
  attention: 'Atenção',
  alert: 'Alerta',
  critical: 'Crítico',
}
