import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { AlertsPage } from '../pages/AlertsPage'
import { Dashboard } from '../pages/Dashboard'
import { MapPage } from '../pages/MapPage'
import { NewsPage } from '../pages/NewsPage'
import { RegionPage } from '../pages/RegionPage'
import { SettingsPage } from '../pages/SettingsPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="/app" element={<Layout />}>
        <Route index element={<MapPage />} />
        <Route path="inicio" element={<Dashboard />} />
        <Route path="mapa" element={<MapPage />} />
        <Route path="alertas" element={<AlertsPage />} />
        <Route path="minha-regiao" element={<RegionPage />} />
        <Route path="noticias" element={<NewsPage />} />
        <Route path="configuracoes" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
