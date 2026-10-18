import { useState } from 'react'
import {
  Circle,
  CircleMarker,
  MapContainer,
  Polygon,
  Polyline,
  Popup,
  TileLayer,
} from 'react-leaflet'
import type { MapData } from '../services/mapService'
import { StatusBadge } from './StatusBadge'

const riskColor: Record<string, string> = {
  normal: '#00C853',
  attention: '#FFD600',
  alert: '#FF6D00',
  critical: '#FF1744',
}

const pointColor: Record<string, string> = {
  station: '#00B0FF',
  shelter: '#00E676',
  point: '#2979FF',
}

const severityLabel: Record<string, string> = {
  normal: 'Normal',
  attention: 'Atenção',
  alert: 'Alerta',
  critical: 'Crítico',
}

const floodedStreetWidth: Record<string, number> = {
  normal: 5,
  attention: 7,
  alert: 9,
  critical: 11,
}

function FloodedStreet({
  street,
}: {
  street: MapData['floodedStreets'][number]
}) {
  const color = riskColor[street.severity]
  const width = floodedStreetWidth[street.severity]

  return (
    <>
      <Polyline
        positions={street.positions}
        pathOptions={{
          color: '#10233a',
          weight: width + 5,
          opacity: 0.82,
          lineCap: 'round',
          lineJoin: 'round',
        }}
        interactive={false}
      />
      <Polyline
        positions={street.positions}
        pathOptions={{
          color,
          weight: width,
          opacity: 1,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      >
        <Popup>
          <strong>{street.name}</strong>
          <br />
          Situação: <strong>Rua alagada</strong>
          <br />
          Nível: {severityLabel[street.severity]}
          <br />
          Profundidade simulada: {street.depthCm} cm
          <br />
          Atualização: {street.updatedAt}
          <br />
          <small>Trecho viário de referência real. Situação de alagamento simulada para demonstração.</small>
        </Popup>
      </Polyline>
    </>
  )
}

// Raios curtos apenas para destacar a vizinhança do ponto amostral.
const floodRadius: Record<string, number> = {
  normal: 28,
  attention: 34,
  alert: 42,
  critical: 50,
}

function FloodBubble({
  lat,
  lng,
  severity,
  intensity,
}: {
  lat: number
  lng: number
  severity: keyof typeof riskColor
  intensity: number
}) {
  const color = riskColor[severity]
  const radius = floodRadius[severity] + Math.min(10, intensity / 12)

  return (
    <>
      <Circle
        center={[lat, lng]}
        radius={radius * 1.65}
        pathOptions={{
          color,
          fillColor: color,
          fillOpacity: 0.09,
          weight: 2,
          opacity: 0.28,
        }}
        interactive={false}
      />
      <CircleMarker
        center={[lat, lng]}
        radius={Math.max(8, Math.min(15, 7 + intensity / 15))}
        pathOptions={{
          color: '#ffffff',
          weight: 2,
          fillColor: color,
          fillOpacity: 1,
        }}
      >
        <Popup>
          <strong>{severityLabel[severity]} — ponto amostral</strong>
          <br />
          Intensidade simulada: {intensity}%
          <br />
          Localização pontual demonstrativa.
        </Popup>
      </CircleMarker>
    </>
  )
}

function SusceptibilityZone({
  lat,
  lng,
  severity,
  radius,
}: {
  lat: number
  lng: number
  severity: keyof typeof riskColor
  radius: number
}) {
  const color = riskColor[severity]

  return (
    <Circle
      center={[lat, lng]}
      radius={radius}
      pathOptions={{
        color,
        fillColor: color,
        fillOpacity: 0.17,
        weight: 2,
        opacity: 0.7,
        dashArray: '7 5',
      }}
    >
      <Popup>
        <strong>Área propensa — {severityLabel[severity]}</strong>
        <br />
        Microzona de suscetibilidade simulada.
        <br />
        Raio demonstrativo: {radius} m.
      </Popup>
    </Circle>
  )
}

export function MapView({ data, compact = false }: { data: MapData; compact?: boolean }) {
  const [showFloodPoints, setShowFloodPoints] = useState(true)
  const [showSusceptibility, setShowSusceptibility] = useState(true)
  const [showFloodedStreets, setShowFloodedStreets] = useState(true)

  return (
    <div className={`map-shell ${compact ? 'map-compact' : ''}`}>
      <MapContainer
        center={data.center}
        zoom={data.zoom}
        scrollWheelZoom={!compact}
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
          maxZoom={19}
        />

        {showSusceptibility && data.susceptibilityAreas.map((area) => (
          <SusceptibilityZone
            key={area.id}
            lat={area.lat}
            lng={area.lng}
            severity={area.severity}
            radius={area.radius}
          />
        ))}

        {showSusceptibility && data.riskPolygons.map((polygon) => (
          <Polygon
            key={polygon.id}
            positions={polygon.positions}
            pathOptions={{
              color: riskColor[polygon.severity],
              fillColor: riskColor[polygon.severity],
              fillOpacity: 0.22,
              weight: 2,
              opacity: 0.78,
              dashArray: '6 4',
            }}
          >
            <Popup>
              <strong>{polygon.name}</strong>
              <br />
              Microzona propensa demonstrativa
              <br />
              <StatusBadge severity={polygon.severity} />
            </Popup>
          </Polygon>
        ))}

        {showFloodedStreets && data.floodedStreets.map((street) => (
          street.positions.length > 1 ? (
            <FloodedStreet key={street.id} street={street} />
          ) : null
        ))}

        {showFloodPoints && data.floodPoints.map((point) => (
          <FloodBubble
            key={point.id}
            lat={point.lat}
            lng={point.lng}
            severity={point.severity}
            intensity={point.intensity}
          />
        ))}

        {data.points.map((point) => (
          <CircleMarker
            key={point.id}
            center={[point.lat, point.lng]}
            radius={7}
            pathOptions={{
              color: '#ffffff',
              weight: 2,
              fillColor: pointColor[point.kind],
              fillOpacity: 1,
            }}
          >
            <Popup>
              <strong>{point.name}</strong>
              <br />
              {point.description}
              <br />
              <br />
              <span>Localização real de referência</span>
            </Popup>
          </CircleMarker>
        ))}

        {data.stations.map((station) => (
          <CircleMarker
            key={station.id}
            center={[station.lat, station.lng]}
            radius={8}
            pathOptions={{
              color: '#ffffff',
              weight: 2,
              fillColor: pointColor.station,
              fillOpacity: 1,
            }}
          >
            <Popup>
              <strong>{station.name}</strong>
              <br />
              Nível: {station.level.toFixed(1)} m
              <br />
              Variação: +{station.variation.toFixed(1)} m
              <br />
              <StatusBadge severity={station.status} />
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="map-layer-controls">
        <div className="map-layer-title">Camadas do mapa</div>
        <label className={`map-filter ${showFloodPoints ? 'active' : ''}`}>
          <input
            type="checkbox"
            checked={showFloodPoints}
            onChange={(event) => setShowFloodPoints(event.target.checked)}
          />
          <span className="filter-swatch flood" />
          <span>Pontos de alagamento</span>
        </label>
        <label className={`map-filter ${showSusceptibility ? 'active' : ''}`}>
          <input
            type="checkbox"
            checked={showSusceptibility}
            onChange={(event) => setShowSusceptibility(event.target.checked)}
          />
          <span className="filter-swatch area" />
          <span>Áreas propensas</span>
        </label>
        <label className={`map-filter ${showFloodedStreets ? 'active' : ''}`}>
          <input
            type="checkbox"
            checked={showFloodedStreets}
            onChange={(event) => setShowFloodedStreets(event.target.checked)}
          />
          <span className="filter-swatch street-flood" />
          <span>Ruas alagadas</span>
        </label>
      </div>

      <div className="map-legend">
        <strong>Modelo de risco</strong>
        <span><i className="legend-dot normal" />Normal</span>
        <span><i className="legend-dot attention" />Atenção</span>
        <span><i className="legend-dot alert" />Alerta</span>
        <span><i className="legend-dot critical" />Crítico</span>
        <span className="street-legend"><i className="legend-street-line" />Rua alagada</span>
      </div>
    </div>
  )
}
