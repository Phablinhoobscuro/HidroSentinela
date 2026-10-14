import type { Severity } from '../types'
import { severityLabel } from '../utils/severity'

interface Props {
  severity: Severity
}

export function StatusBadge({ severity }: Props) {
  return <span className={`status-badge status-${severity}`}>{severityLabel[severity]}</span>
}
