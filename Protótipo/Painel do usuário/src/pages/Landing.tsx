import { Link } from 'react-router-dom'

export function Landing() {
  return (
    <main className="landing-page">
      <div className="landing-overlay" />
      <div className="landing-content">
        <div className="landing-brand">⌁ <span>HidroSentinela</span></div>
        <p className="landing-kicker">Monitoramento de Enchentes</p>
        <h1>Informação em tempo real para uma cidade mais segura</h1>
        <p className="landing-text">Acompanhe os níveis dos rios, receba alertas e fique informado sobre áreas de risco na sua região.</p>
        <div className="landing-actions">
          <Link className="btn btn-primary btn-lg" to="/app">Entrar</Link>
          <Link className="btn btn-outline-light btn-lg" to="/app">Criar conta</Link>
        </div>
        <div className="landing-features">
          <span>⌂ <small>Alertas em tempo real</small></span>
          <span>▣ <small>Mapa interativo</small></span>
          <span>⌁ <small>Informações da sua região</small></span>
        </div>
      </div>
    </main>
  )
}
