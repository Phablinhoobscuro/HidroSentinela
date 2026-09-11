
(() => {
  const RISK_COLORS = {
    low: "#39d98a",
    moderate: "#ffd24c",
    high: "#ff624f",
    "very-high": "#d91e3a"
  };

  const RISK_LABELS = {
    low: "Risco baixo",
    moderate: "Risco moderado",
    high: "Risco alto",
    "very-high": "Risco muito alto"
  };

  const state = {
    timelineIndex: 2,
    activeLayer: "risk",
    playing: false,
    playTimer: null,
    map: null,
    layers: {},
    favorite: localStorage.getItem("hidro-favorite") === "true"
  };

  const qs = (selector) => document.querySelector(selector);
  const qsa = (selector) => [...document.querySelectorAll(selector)];

  document.addEventListener("DOMContentLoaded", () => {
    initMap();
    renderTimeline();
    renderAlerts();
    renderPlaces();
    bindEvents();
    applyScenario(state.timelineIndex);
    updateFavoriteButton();
  });


  function refreshMapSize() {
    if (!state.map) return;

    // Leaflet pode calcular o tamanho antes de o layout mobile terminar.
    // Recalcular em pequenos intervalos força o carregamento dos tiles
    // para toda a largura/altura real do container.
    [0, 60, 180, 400, 800].forEach((delay) => {
      setTimeout(() => {
        if (!state.map) return;
        state.map.invalidateSize({ pan: false, animate: false });
      }, delay);
    });
  }

  function observeMapContainer() {
    const mapElement = document.getElementById("map");
    if (!mapElement || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      refreshMapSize();
    });

    observer.observe(mapElement);
  }

  function initMap() {
    if (typeof L === "undefined") {
      const hint = qs("#map-hint");
      hint.textContent = "Mapa indisponível sem internet. Os demais componentes do protótipo continuam navegáveis.";
      hint.classList.remove("hidden");
      return;
    }

    state.map = L.map("map", {
      zoomControl: false,
      attributionControl: false,
      minZoom: 10,
      maxZoom: 18
    }).setView(MOCK_DATA.region.center, MOCK_DATA.region.zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19
    }).addTo(state.map);

    state.layers.risk = L.layerGroup().addTo(state.map);
    state.layers.roads = L.layerGroup().addTo(state.map);
    state.layers.shelters = L.layerGroup().addTo(state.map);
    state.layers.rivers = L.layerGroup().addTo(state.map);
    state.layers.route = L.layerGroup();

    renderMapRiskZones();
    renderRoads();
    renderShelters();
    renderRivers();

    const userIcon = L.divIcon({
      html: `<div style="width:22px;height:22px;border-radius:50%;background:#42a5f5;border:4px solid white;box-shadow:0 0 0 7px rgba(66,165,245,.22),0 6px 18px rgba(0,0,0,.35)"></div>`,
      className: "",
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });

    L.marker([-20.349, -40.379], { icon: userIcon })
      .addTo(state.map)
      .bindPopup("<strong>Localização simulada</strong><br>Usuário na região de Campo Grande.");

    state.map.on("click", (event) => {
      const { lat, lng } = event.latlng;
      showMapHint(`Ponto selecionado: ${lat.toFixed(4)}, ${lng.toFixed(4)} • dados simulados`);
    });

    observeMapContainer();
    refreshMapSize();
  }


  window.addEventListener("load", refreshMapSize);
  window.addEventListener("resize", refreshMapSize);
  window.addEventListener("orientationchange", refreshMapSize);

  function renderMapRiskZones() {
    if (!state.map) return;
    state.layers.risk.clearLayers();

    MOCK_DATA.riskZones.forEach((zone, index) => {
      const scenario = MOCK_DATA.timeline[state.timelineIndex];
      const scenarioMultiplier = [0.72, 0.85, 1, 1.25, 1.1, 0.8][state.timelineIndex];
      const baseColor = index === 2 && scenario.risk === "very-high"
        ? RISK_COLORS["very-high"]
        : RISK_COLORS[zone.severity];

      L.circle(zone.center, {
        radius: zone.radius * scenarioMultiplier,
        color: baseColor,
        weight: 2,
        fillColor: baseColor,
        fillOpacity: scenario.risk === "very-high" ? 0.34 : 0.24
      })
        .bindPopup(`<strong>${zone.name}</strong><br>Nível simulado: ${RISK_LABELS[zone.severity]}`)
        .addTo(state.layers.risk);
    });
  }

  function renderRoads() {
    if (!state.map) return;
    state.layers.roads.clearLayers();

    MOCK_DATA.affectedRoads.forEach((road) => {
      const color = road.severity === "high" ? "#ff4d5e" : "#ffd24c";
      L.polyline(road.points, {
        color,
        weight: 7,
        opacity: 0.82,
        dashArray: road.status === "Interditada" ? "8 8" : null
      })
        .bindPopup(`<strong>${road.name}</strong><br>${road.status} • cenário simulado`)
        .addTo(state.layers.roads);
    });
  }

  function renderShelters() {
    if (!state.map) return;
    state.layers.shelters.clearLayers();

    MOCK_DATA.shelters.forEach((shelter) => {
      const icon = L.divIcon({
        html: `<div class="marker-shelter">🏠</div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker(shelter.coords, { icon })
        .bindPopup(`
          <strong>${shelter.name}</strong><br>
          ${shelter.address}<br>
          ${shelter.status} • ${shelter.capacity}
        `)
        .addTo(state.layers.shelters);
    });
  }

  function renderRivers() {
    if (!state.map) return;
    state.layers.rivers.clearLayers();

    MOCK_DATA.rivers.forEach((river) => {
      const icon = L.divIcon({
        html: `<div class="marker-river">🌊</div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker(river.coords, { icon })
        .bindPopup(`<strong>${river.name}</strong><br>Nível: ${river.level}<br>Tendência: ${river.trend}`)
        .addTo(state.layers.rivers);
    });
  }

  function renderSafeRoute() {
    if (!state.map) return;

    state.layers.route.clearLayers();
    L.polyline(MOCK_DATA.safeRoute.points, {
      color: "#33e19b",
      weight: 7,
      opacity: 0.92
    })
      .bindPopup(`<strong>${MOCK_DATA.safeRoute.name}</strong><br>Rota meramente demonstrativa.`)
      .addTo(state.layers.route);

    if (!state.map.hasLayer(state.layers.route)) {
      state.layers.route.addTo(state.map);
    }

    state.map.fitBounds(L.latLngBounds(MOCK_DATA.safeRoute.points), { padding: [28, 28] });
  }

  function renderTimeline() {
    const timeline = qs("#timeline");
    timeline.innerHTML = "";

    MOCK_DATA.timeline.forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = item.time;
      button.dataset.index = index;
      if (index === state.timelineIndex) button.classList.add("active");
      button.addEventListener("click", () => {
        stopPlayback();
        applyScenario(index);
      });
      timeline.appendChild(button);
    });
  }

  function applyScenario(index) {
    state.timelineIndex = index;
    const scenario = MOCK_DATA.timeline[index];

    qsa("#timeline button").forEach((button, idx) => {
      button.classList.toggle("active", idx === index);
    });

    qs("#risk-label").textContent = scenario.label;
    qs("#rain-value").textContent = `${scenario.rain} mm`;
    qs("#river-value").textContent = scenario.riverTrend;
    qs("#update-value").textContent = scenario.updated;
    qs("#time-bubble").textContent = scenario.time;

    qs("#home-risk").textContent = scenario.label;
    qs("#home-summary").textContent = scenario.summary;
    qs("#home-rain").textContent = `${scenario.rain} mm`;
    qs("#home-river").textContent = `${scenario.riverLevel.toFixed(2).replace(".", ",")} m`;
    qs("#home-river-trend").textContent = scenario.riverTrend;

    const riskPill = qs("#risk-pill");
    riskPill.className = `risk-pill risk-${scenario.risk}`;

    const hero = qs(".hero-status");
    hero.className = `hero-status ${scenario.risk === "very-high" ? "risk-high-bg" : "risk-high-bg"}`;

    qs("#risk-reasons").innerHTML = scenario.reasons.map((item) => `<li>${item}</li>`).join("");
    qs("#orientation-list").innerHTML = scenario.orientations.map((item) => `<li>${item}</li>`).join("");

    renderMapRiskZones();
  }

  function bindEvents() {
    qsa("[data-nav]").forEach((button) => {
      button.addEventListener("click", () => navigate(button.dataset.nav));
    });

    qsa("[data-action]").forEach((button) => {
      button.addEventListener("click", () => handleAction(button.dataset.action));
    });

    qs("#play-btn").addEventListener("click", togglePlayback);
    qs("#sheet-close").addEventListener("click", closeSheet);
    qs("#modal-backdrop").addEventListener("click", closeSheet);
    qs("#add-place-btn").addEventListener("click", () => {
      showMapHint("Adicionar locais será uma funcionalidade futura. Nesta versão, a interação é apenas demonstrativa.");
    });
  }

  function navigate(target) {
    const screenMap = {
      home: "#screen-home",
      map: "#screen-map",
      alerts: "#screen-alerts",
      places: "#screen-places",
      more: "#screen-more"
    };

    qsa(".screen").forEach((screen) => screen.classList.remove("active"));
    const targetScreen = qs(screenMap[target] || "#screen-map");
    targetScreen.classList.add("active");

    qsa(".bottom-nav button").forEach((button) => {
      button.classList.toggle("active", button.dataset.nav === target);
    });

    closeSheet();

    if (target === "map" && state.map) {
      refreshMapSize();
    }
  }

  function handleAction(action) {
    const handlers = {
      center: centerMap,
      search: showSearchSheet,
      layers: showLayersSheet,
      favorite: toggleFavorite,
      shelters: showShelters,
      routes: showRoutes,
      "risk-details": showRiskDetails
    };

    handlers[action]?.();
  }

  function centerMap() {
    if (!state.map) return;
    state.map.setView(MOCK_DATA.region.center, MOCK_DATA.region.zoom);
    showMapHint("Mapa centralizado na região simulada.");
  }

  function showSearchSheet() {
    openSheet(
      "Buscar região",
      "Pesquisa simulada",
      `
        <div class="sheet-action">
          <span>🔎 Campo Grande — Cariacica</span><span>›</span>
        </div>
        <div class="sheet-action">
          <span>🔎 Cobilândia — Vila Velha</span><span>›</span>
        </div>
        <div class="sheet-action">
          <span>🔎 Centro — Vila Velha</span><span>›</span>
        </div>
        <p style="color:#9fb3c0;font-size:11px;margin-top:12px">
          Busca demonstrativa. Não há consulta a endereços reais nesta versão.
        </p>
      `
    );
  }

  function showLayersSheet() {
    const options = [
      ["risk", "🌧️ Chuva e risco de enchente"],
      ["roads", "🚧 Vias afetadas"],
      ["shelters", "🏠 Abrigos"],
      ["rivers", "🌊 Nível dos rios"]
    ];

    const html = options
      .map(([key, label]) => {
        const layer = state.layers[key];
        const active = state.map && layer && state.map.hasLayer(layer);
        return `
          <button class="layer-option ${active ? "active" : ""}" data-toggle-layer="${key}">
            <span>${label}</span>
            <span>${active ? "✓" : "○"}</span>
          </button>
        `;
      })
      .join("");

    openSheet("Camadas do mapa", "Visualização", html);

    qsa("[data-toggle-layer]").forEach((button) => {
      button.addEventListener("click", () => {
        toggleLayer(button.dataset.toggleLayer);
        showLayersSheet();
      });
    });
  }

  function toggleLayer(layerName) {
    if (!state.map || !state.layers[layerName]) return;
    const layer = state.layers[layerName];

    if (state.map.hasLayer(layer)) {
      state.map.removeLayer(layer);
    } else {
      layer.addTo(state.map);
    }
  }

  function showShelters() {
    if (state.map && !state.map.hasLayer(state.layers.shelters)) {
      state.layers.shelters.addTo(state.map);
    }

    if (state.map) {
      state.map.fitBounds(
        L.latLngBounds(MOCK_DATA.shelters.map((item) => item.coords)),
        { padding: [45, 45] }
      );
    }

    const html = MOCK_DATA.shelters
      .map(
        (shelter) => `
          <button class="sheet-action" data-shelter="${shelter.id}">
            <span>
              <strong>${shelter.name}</strong><br>
              <small style="color:#9fb3c0">${shelter.distance} • ${shelter.status}</small>
            </span>
            <span>›</span>
          </button>
        `
      )
      .join("");

    openSheet("Abrigos próximos", "Pontos seguros simulados", html);

    qsa("[data-shelter]").forEach((button) => {
      button.addEventListener("click", () => {
        const shelter = MOCK_DATA.shelters.find((item) => item.id === Number(button.dataset.shelter));
        if (shelter && state.map) {
          closeSheet();
          state.map.setView(shelter.coords, 15);
        }
      });
    });
  }

  function showRoutes() {
    renderSafeRoute();

    const html = `
      <div class="sheet-stat">
        <small>Rota demonstrativa</small>
        <strong>Até Centro Comunitário Esperança</strong>
      </div>
      <div class="sheet-grid" style="margin-top:8px">
        <div class="sheet-stat"><small>Distância</small><strong>4,1 km</strong></div>
        <div class="sheet-stat"><small>Condição</small><strong style="color:#39d98a">Disponível</strong></div>
      </div>
      <p style="color:#9fb3c0;font-size:11px;line-height:1.6;margin-top:12px">
        A rota foi desenhada apenas para demonstrar a experiência. Não representa
        condições reais de trânsito ou segurança.
      </p>
    `;

    openSheet("Rotas seguras", "Mobilidade", html);
  }

  function showRiskDetails() {
    const scenario = MOCK_DATA.timeline[state.timelineIndex];

    openSheet(
      scenario.label,
      `${MOCK_DATA.region.name} • ${scenario.time}`,
      `
        <div class="sheet-grid">
          <div class="sheet-stat"><small>Chuva</small><strong>${scenario.rain} mm</strong></div>
          <div class="sheet-stat"><small>Rio</small><strong>${scenario.riverLevel.toFixed(2).replace(".", ",")} m</strong></div>
          <div class="sheet-stat"><small>Tendência</small><strong>${scenario.riverTrend}</strong></div>
          <div class="sheet-stat"><small>Atualização</small><strong>${scenario.updated}</strong></div>
        </div>
        <h4 style="margin:18px 0 8px">Por que existe risco?</h4>
        <ul class="simple-list">
          ${scenario.reasons.map((reason) => `<li>${reason}</li>`).join("")}
        </ul>
        <p style="color:#9fb3c0;font-size:10px;line-height:1.55;margin-top:12px">
          Dados e classificação totalmente simulados para validação visual.
        </p>
      `
    );
  }

  function toggleFavorite() {
    state.favorite = !state.favorite;
    localStorage.setItem("hidro-favorite", String(state.favorite));
    updateFavoriteButton();
    showMapHint(state.favorite ? "Região adicionada aos favoritos." : "Região removida dos favoritos.");
  }

  function updateFavoriteButton() {
    const button = qs("#favorite-btn");
    button.textContent = state.favorite ? "♥" : "♡";
    button.style.color = state.favorite ? "#ff6f83" : "#fff";
  }

  function togglePlayback() {
    if (state.playing) {
      stopPlayback();
      return;
    }

    state.playing = true;
    qs("#play-btn").textContent = "Ⅱ";

    state.playTimer = setInterval(() => {
      const next = (state.timelineIndex + 1) % MOCK_DATA.timeline.length;
      applyScenario(next);
    }, 1200);
  }

  function stopPlayback() {
    if (!state.playing) return;
    state.playing = false;
    qs("#play-btn").textContent = "▶";
    clearInterval(state.playTimer);
    state.playTimer = null;
  }

  function renderAlerts() {
    qs("#alerts-list").innerHTML = MOCK_DATA.alerts
      .map(
        (alert) => `
          <article class="alert-card ${alert.severity}">
            <div class="alert-card-header">
              <div>
                <h3>${alert.title}</h3>
                <p>${alert.region}</p>
              </div>
              <span class="meta-pill">${alert.time}</span>
            </div>
            <p><strong>Motivo:</strong> ${alert.reason}</p>
            <p><strong>Orientação:</strong> ${alert.guidance}</p>
            <div class="alert-meta">
              <span class="meta-pill">${alert.source}</span>
              <span class="meta-pill">Dado simulado</span>
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderPlaces() {
    qs("#places-list").innerHTML = MOCK_DATA.places
      .map(
        (place) => `
          <article class="place-card">
            <div class="place-card-header">
              <div>
                <h3>${place.name}</h3>
                <p>${place.region}</p>
              </div>
              <span>${place.favorite ? "♥" : "♡"}</span>
            </div>
            <div class="place-meta">
              <span class="meta-pill">Risco: ${place.risk}</span>
              <span class="meta-pill">Simulado</span>
            </div>
          </article>
        `
      )
      .join("");
  }

  function openSheet(title, kicker, html) {
    qs("#sheet-title").textContent = title;
    qs("#sheet-kicker").textContent = kicker;
    qs("#sheet-content").innerHTML = html;

    qs("#modal-backdrop").classList.remove("hidden");
    qs("#bottom-sheet").classList.remove("hidden");
  }

  function closeSheet() {
    qs("#modal-backdrop").classList.add("hidden");
    qs("#bottom-sheet").classList.add("hidden");
  }

  let hintTimer = null;
  function showMapHint(message) {
    const hint = qs("#map-hint");
    hint.textContent = message;
    hint.classList.remove("hidden");

    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => hint.classList.add("hidden"), 2200);
  }
})();
