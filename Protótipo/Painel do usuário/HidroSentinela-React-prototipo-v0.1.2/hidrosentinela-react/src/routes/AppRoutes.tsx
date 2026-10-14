import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { AlertsPage } from '../pages/AlertsPage'
import { MapPage } from '../pages/MapPage'
import { NewsPage } from '../pages/NewsPage'
import { RegionPage } from '../pages/RegionPage'
import { SettingsPage } from '../pages/SettingsPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="/app" element={<Layout />}>
        {/* O mapa é a tela principal do HidroSentinela. */}
        <Route index element={<MapPage />} />

        {/* Rotas antigas mantidas apenas para não quebrar links existentes. */}
        <Route path="inicio" element={<Navigate to="/app" replace />} />
        <Route path="mapa" element={<Navigate to="/app" replace />} />

        <Route path="alertas" element={<AlertsPage />} />
        <Route path="minha-regiao" element={<RegionPage />} />
        <Route path="noticias" element={<NewsPage />} />
        <Route path="configuracoes" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
