interface Props {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="state-card state-error">
      <strong>Não foi possível carregar os dados.</strong>
      <span>{message}</span>
      {onRetry && <button className="btn btn-primary" onClick={onRetry}>Tentar novamente</button>}
    </div>
  )
}
