interface Props {
  values: number[]
  labels: string[]
}

export function RiverChart({ values, labels }: Props) {
  const width = 640
  const height = 210
  const padX = 32
  const padY = 24
  const min = Math.min(...values) - 0.2
  const max = Math.max(...values) + 0.2
  const points = values.map((value, index) => {
    const x = padX + (index / (values.length - 1)) * (width - padX * 2)
    const y = height - padY - ((value - min) / (max - min)) * (height - padY * 2)
    return [x, y] as const
  })
  const line = points.map(([x, y]) => `${x},${y}`).join(' ')
  const area = `${padX},${height - padY} ${line} ${width - padX},${height - padY}`

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Evolução do nível do rio">
        <defs>
          <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2d7ff9" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2d7ff9" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#areaFill)" />
        <polyline points={line} fill="none" stroke="#2d7ff9" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {points.map(([x, y], index) => <circle key={labels[index]} cx={x} cy={y} r="4" fill="#ffffff" stroke="#2d7ff9" strokeWidth="3" />)}
        {labels.map((label, index) => <text key={label} x={points[index][0]} y={height - 4} textAnchor="middle" fill="#64748b" fontSize="12">{label}</text>)}
      </svg>
    </div>
  )
}
