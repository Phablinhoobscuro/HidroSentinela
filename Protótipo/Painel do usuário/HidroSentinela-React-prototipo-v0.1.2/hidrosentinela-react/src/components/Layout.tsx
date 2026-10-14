import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'

const menu = [
  { to: '/app', label: 'Início', icon: '⌂' },
  { to: '/app/alertas', label: 'Alertas', icon: '!' },
  { to: '/app/minha-regiao', label: 'Minha Região', icon: '⌖' },
  { to: '/app/noticias', label: 'Notícias', icon: '▤' },
  { to: '/app/configuracoes', label: 'Configurações', icon: '⚙' },
]

export function Layout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isMapMode = pathname === '/app'

  return (
    <div className={`app-shell ${isMapMode ? 'app-shell-map' : ''}`}>
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">⌁</div>
          <div>
            <strong>HidroSentinela</strong>
            <span>Monitoramento de enchentes</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              className="nav-link"
              onClick={() => setOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="profile-mini">
          <div className="avatar">JS</div>
          <div><strong>João Silva</strong><span>Morador</span></div>
        </div>
      </aside>

      {open && <button className="mobile-menu-backdrop" aria-label="Fechar menu" onClick={() => setOpen(false)} />}
      <button className={`mobile-menu ${open ? 'is-open' : ''}`} onClick={() => setOpen((value) => !value)} aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open}>
        <span aria-hidden="true">{open ? '×' : '☰'}</span>
      </button>

      <main className={`app-content ${isMapMode ? 'app-content-map' : ''}`}>
        <div className="demo-banner">Dados demonstrativos — protótipo inicial do HidroSentinela</div>
        <Outlet />
      </main>
    </div>
  )
}
