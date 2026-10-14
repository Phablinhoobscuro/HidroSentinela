export function Loading({ label = 'Carregando informações...' }: { label?: string }) {
  return (
    <div className="state-card">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  )
}
