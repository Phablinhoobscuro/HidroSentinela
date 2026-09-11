# HidroSentinela v0.2 — Protótipo Mobile do Cidadão

Protótipo visual e navegável do HidroSentinela voltado ao usuário final.

> **Importante:** esta versão utiliza exclusivamente dados simulados e não substitui alertas, previsões ou orientações oficiais.

## Objetivo

Validar visualmente como moradores e trabalhadores de regiões suscetíveis a enchentes poderiam consultar:

- nível de risco da própria região;
- chuva acumulada e tendência de rios;
- áreas de risco;
- vias afetadas;
- abrigos;
- rotas alternativas simuladas;
- alertas;
- orientações práticas.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- Leaflet.js
- OpenStreetMap
- LocalStorage
- Dados simulados em JavaScript

## Estrutura

```text
HidroSentinela_v0.2_Prototipo_Mobile/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── dados.js
│   └── app.js
└── assets/
```

## Como executar

Você pode abrir `index.html` diretamente no navegador.

Para uma experiência melhor, especialmente com o mapa do OpenStreetMap, recomenda-se executar com um servidor local.

### VS Code

Use a extensão **Live Server** e abra `index.html`.

### Python

```bash
python -m http.server 5500
```

Depois acesse:

```text
http://localhost:5500
```

## Funcionalidades demonstradas

### Mapa
- mapa interativo com Leaflet;
- regiões simuladas por nível de risco;
- vias afetadas;
- abrigos;
- ponto de rio;
- localização simulada;
- camadas ligáveis/desligáveis.

### Linha do tempo
- horários simulados;
- alteração do risco;
- atualização de chuva, nível do rio e orientações;
- reprodução automática da evolução.

### Mobilidade
- vias em atenção, alagadas e interditadas;
- rota alternativa simulada;
- visualização no mapa.

### Abrigos
- dois pontos seguros fictícios;
- endereço, distância e capacidade simulados.

### Alertas
- lista de alertas fictícios;
- gravidade, horário, motivo e orientação.

### Navegação
- Início;
- Mapa;
- Alertas;
- Locais;
- Mais.

## Fora do escopo

Esta versão não possui:

- backend;
- banco de dados real;
- autenticação;
- APIs reais;
- geolocalização real;
- notificações push;
- Machine Learning;
- previsão real;
- roteamento real;
- integração real com CEMADEN, SGB/SACE, INMET ou Defesa Civil.

## Evolução do projeto

- **v0.1:** painel operacional / institucional.
- **v0.2:** experiência mobile do cidadão após a etapa de Design Thinking.

A versão v0.2 prioriza:

**integração → compreensão → localização → orientação → previsão complementar**

em vez de concentrar a experiência do usuário em dados técnicos.


## Correção v0.2.1

Foi adicionada uma correção para o Leaflet recalcular automaticamente o tamanho
do mapa após o carregamento, redimensionamento da janela, rotação do dispositivo
e retorno à aba do mapa. Isso evita a exibição parcial dos tiles do OpenStreetMap.


## Correção v0.2.2

Removidos os atributos SRI (`integrity`) dos recursos Leaflet carregados pelo CDN.
No ambiente de teste, o navegador estava bloqueando `leaflet.css` por divergência de hash,
o que fazia os tiles do mapa aparecerem como blocos soltos.

Também foi mantida a correção de `invalidateSize()`/`ResizeObserver` da v0.2.1.
