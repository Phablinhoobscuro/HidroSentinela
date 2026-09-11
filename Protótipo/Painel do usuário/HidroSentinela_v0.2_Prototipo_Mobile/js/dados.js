
const MOCK_DATA = {
  region: {
    id: "grande-vitoria",
    name: "Cariacica / Vila Velha",
    center: [-20.337, -40.372],
    zoom: 12
  },

  timeline: [
    {
      time: "09:00",
      risk: "moderate",
      label: "Risco moderado",
      rain: 24,
      riverLevel: 3.15,
      riverTrend: "estável",
      updated: "há 6 min",
      summary: "Chuva persistente e pontos de atenção em áreas mais baixas.",
      reasons: [
        "Chuva acumulada aumentando nas últimas horas.",
        "Solo já bastante úmido em áreas suscetíveis.",
        "Histórico local indica alagamentos com volumes semelhantes."
      ],
      orientations: [
        "Acompanhe as atualizações da região.",
        "Evite estacionar em vias conhecidas por alagamentos.",
        "Mantenha documentos e itens importantes protegidos."
      ]
    },
    {
      time: "12:00",
      risk: "moderate",
      label: "Risco moderado",
      rain: 31,
      riverLevel: 3.28,
      riverTrend: "subindo",
      updated: "há 5 min",
      summary: "A chuva ganhou intensidade e o nível do rio começou a subir.",
      reasons: [
        "Aumento do volume de chuva acumulada.",
        "Nível do rio com tendência de elevação.",
        "Previsão simulada indica continuidade da chuva."
      ],
      orientations: [
        "Reduza deslocamentos desnecessários.",
        "Evite áreas próximas a rios e canais.",
        "Observe rotas alternativas antes de sair."
      ]
    },
    {
      time: "15:00",
      risk: "high",
      label: "Risco alto",
      rain: 48,
      riverLevel: 3.70,
      riverTrend: "subindo",
      updated: "há 8 min",
      summary: "Há condições favoráveis a alagamentos nas próximas horas.",
      reasons: [
        "Chuva intensa nas últimas horas.",
        "Nível do rio aumentando de forma contínua.",
        "Continuidade da chuva no cenário simulado.",
        "Histórico de alagamentos em pontos próximos."
      ],
      orientations: [
        "Evite vias sinalizadas como alagadas ou em atenção.",
        "Consulte rotas alternativas antes de se deslocar.",
        "Mantenha documentos e itens importantes em local elevado.",
        "Em emergência, procure a Defesa Civil (199) ou Bombeiros (193)."
      ]
    },
    {
      time: "18:00",
      risk: "very-high",
      label: "Risco muito alto",
      rain: 67,
      riverLevel: 4.08,
      riverTrend: "subindo rápido",
      updated: "há 3 min",
      summary: "Cenário crítico simulado com vias afetadas e aumento rápido do nível da água.",
      reasons: [
        "Chuva muito intensa acumulada.",
        "Nível do rio com subida rápida.",
        "Múltiplas ocorrências de alagamento simuladas.",
        "Condições semelhantes a eventos históricos críticos."
      ],
      orientations: [
        "Evite deslocamentos sempre que possível.",
        "Não atravesse áreas com água acumulada.",
        "Siga orientações dos órgãos oficiais.",
        "Se estiver em área de risco, busque ponto seguro antes do agravamento."
      ]
    },
    {
      time: "21:00",
      risk: "high",
      label: "Risco alto",
      rain: 58,
      riverLevel: 3.92,
      riverTrend: "estabilizando",
      updated: "há 7 min",
      summary: "A chuva diminuiu, mas ainda existem pontos alagados e risco residual.",
      reasons: [
        "Acúmulo de água ainda elevado.",
        "Nível do rio permanece acima do normal.",
        "Vias continuam comprometidas em alguns pontos."
      ],
      orientations: [
        "Evite vias ainda sinalizadas como afetadas.",
        "Acompanhe a redução do nível da água antes de sair.",
        "Não retorne a áreas interditadas sem liberação."
      ]
    },
    {
      time: "00:00",
      risk: "moderate",
      label: "Risco moderado",
      rain: 39,
      riverLevel: 3.50,
      riverTrend: "descendo",
      updated: "há 11 min",
      summary: "Condições em melhora, com redução gradual do nível da água.",
      reasons: [
        "Redução da intensidade da chuva.",
        "Nível do rio começando a baixar.",
        "Menor número de ocorrências simuladas."
      ],
      orientations: [
        "Continue evitando áreas ainda afetadas.",
        "Acompanhe orientações oficiais durante a madrugada.",
        "Registre danos apenas quando o local estiver seguro."
      ]
    }
  ],

  riskZones: [
    {
      name: "Campo Grande",
      center: [-20.344, -40.392],
      radius: 1700,
      severity: "high"
    },
    {
      name: "Itacibá",
      center: [-20.315, -40.402],
      radius: 1200,
      severity: "moderate"
    },
    {
      name: "Cobilândia",
      center: [-20.382, -40.345],
      radius: 1500,
      severity: "very-high"
    },
    {
      name: "Centro de Vila Velha",
      center: [-20.329, -40.292],
      radius: 1200,
      severity: "moderate"
    }
  ],

  shelters: [
    {
      id: 1,
      name: "EMEF Ponto Seguro",
      coords: [-20.355, -40.381],
      address: "Av. Principal, Campo Grande — Cariacica",
      distance: "1,2 km",
      status: "Aberto",
      capacity: "120 pessoas"
    },
    {
      id: 2,
      name: "Centro Comunitário Esperança",
      coords: [-20.372, -40.332],
      address: "Rua das Palmeiras, Vila Velha",
      distance: "2,6 km",
      status: "Aberto",
      capacity: "80 pessoas"
    }
  ],

  rivers: [
    {
      name: "Rio Formate",
      coords: [-20.351, -40.401],
      level: "3,7 m",
      trend: "subindo"
    }
  ],

  affectedRoads: [
    {
      name: "Av. Expedito Garcia",
      status: "Alagada",
      severity: "high",
      points: [
        [-20.348, -40.386],
        [-20.345, -40.381],
        [-20.342, -40.374]
      ]
    },
    {
      name: "Av. Carlos Lindenberg",
      status: "Em atenção",
      severity: "moderate",
      points: [
        [-20.360, -40.337],
        [-20.350, -40.326],
        [-20.339, -40.317]
      ]
    },
    {
      name: "Rua Santa Clara",
      status: "Interditada",
      severity: "high",
      points: [
        [-20.384, -40.356],
        [-20.380, -40.349],
        [-20.375, -40.344]
      ]
    }
  ],

  safeRoute: {
    name: "Rota alternativa simulada",
    points: [
      [-20.347, -40.405],
      [-20.353, -40.394],
      [-20.360, -40.380],
      [-20.370, -40.367],
      [-20.374, -40.351],
      [-20.372, -40.332]
    ]
  },

  alerts: [
    {
      id: 1,
      severity: "high",
      title: "Risco alto de alagamento",
      region: "Campo Grande — Cariacica",
      time: "15:08",
      source: "Cenário simulado",
      reason: "Chuva intensa + elevação do nível do rio.",
      guidance: "Evite a Av. Expedito Garcia e acompanhe rotas alternativas."
    },
    {
      id: 2,
      severity: "moderate",
      title: "Via em atenção",
      region: "Av. Carlos Lindenberg",
      time: "14:42",
      source: "Cenário simulado",
      reason: "Acúmulo de água em pontos baixos.",
      guidance: "Reduza a velocidade e evite deslocamentos desnecessários."
    },
    {
      id: 3,
      severity: "low",
      title: "Abrigo disponível",
      region: "Vila Velha",
      time: "14:20",
      source: "Cenário simulado",
      reason: "Ponto seguro disponível para demonstração.",
      guidance: "Consulte o mapa para visualizar o ponto."
    }
  ],

  places: [
    {
      id: 1,
      name: "Casa",
      region: "Campo Grande — Cariacica",
      risk: "Alto",
      favorite: true
    },
    {
      id: 2,
      name: "Trabalho",
      region: "Cobilândia — Vila Velha",
      risk: "Muito alto",
      favorite: true
    },
    {
      id: 3,
      name: "Centro",
      region: "Vila Velha",
      risk: "Moderado",
      favorite: false
    }
  ]
};
