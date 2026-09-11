# HidroSentinela

> Plataforma acadêmica para integração, visualização e comunicação de informações relacionadas a enchentes e inundações no Espírito Santo.

## Sobre o projeto

O **HidroSentinela** é um projeto acadêmico desenvolvido no contexto do Projeto Integrador de Extensão da **UniSales**.

A proposta surgiu a partir da necessidade de compreender como informações sobre chuva, níveis de rios, áreas suscetíveis, ocorrências anteriores e alertas chegam até a população.

Após a aplicação de técnicas de **Design Thinking**, entrevistas com moradores e contato com a Defesa Civil, o projeto passou a priorizar não apenas o monitoramento, mas principalmente a transformação de dados técnicos e distribuídos em informações **claras, localizadas, confiáveis e orientadas à ação**.

> **Importante:** o HidroSentinela possui caráter acadêmico e experimental. A plataforma não pretende substituir sistemas oficiais de monitoramento, previsão ou alerta.

---

## Problema identificado

A pesquisa realizada durante a etapa de imersão indicou alguns pontos recorrentes:

- informações relacionadas a enchentes podem estar distribuídas em diferentes fontes;
- alertas nem sempre chegam à população com antecedência suficiente;
- dados técnicos podem ser difíceis de interpretar pelo público geral;
- o usuário precisa entender o risco da **sua própria região**, e não apenas uma condição ampla do município ou estado;
- enchentes afetam também a **mobilidade**, dificultando deslocamentos, acesso ao trabalho e retorno para casa;
- moradores precisam de informações práticas, como vias afetadas, rotas seguras, abrigos e orientações.

Com base nesses achados, o projeto passou a ser orientado pela seguinte ideia:

> **Integrar informações públicas sobre enchentes e transformá-las em uma visão simples, localizada e acionável para a população.**

---

## Objetivo

Desenvolver um sistema capaz de integrar dados públicos relacionados a enchentes e inundações e apresentá-los por meio de uma interface geográfica de fácil compreensão.

Entre os principais objetivos estão:

- integrar fontes públicas de dados hidrometeorológicos;
- apresentar informações por região;
- utilizar mapas para visualização de risco;
- disponibilizar histórico de ocorrências e variáveis ambientais;
- traduzir dados técnicos para uma linguagem mais acessível;
- apoiar a compreensão e a tomada de decisão da população;
- explorar futuramente recursos de alerta, geolocalização e análise preditiva.

---

## Público-alvo

O público principal é formado por:

- moradores de regiões suscetíveis a enchentes e inundações;
- pessoas que trabalham ou circulam por áreas frequentemente afetadas.

Também foram considerados como stakeholders:

- Defesa Civil;
- Corpo de Bombeiros;
- gestores públicos;
- CEMADEN;
- SGB/SACE;
- INMET.

---

## Design Thinking

O desenvolvimento da solução está sendo orientado por um processo de Design Thinking.

As etapas documentadas no repositório incluem:

### Entendimento

- Mapa de Stakeholders;
- Matriz CSD;
- Matriz de Afinidade;
- levantamento inicial do problema.

### Imersão

- preparação para imersão profunda;
- entrevistas com moradores;
- formulário on-line;
- entrevista com a Defesa Civil;
- síntese da imersão.

### Persona

Foi criada uma persona representando o perfil médio do público afetado identificado nas pesquisas realizadas em **Vila Velha e Cariacica**.

### Ideação

A etapa de ideação reuniu possibilidades relacionadas a:

- informação e compreensão;
- mapas e localização;
- alertas;
- mobilidade e segurança;
- histórico;
- confiança e transparência;
- orientação à população.

### Mapa Conceitual

A proposta atual do HidroSentinela é sintetizada como:

> **Uma plataforma que centraliza e traduz informações sobre enchentes em dados claros, localizados e úteis para a população.**

---

# Protótipos

O projeto possui atualmente duas linhas de prototipação.

## v0.1 — Painel Operacional

O primeiro protótipo foi criado no início do semestre, antes da conclusão das etapas de Design Thinking.

Após a imersão, identificou-se que sua estrutura é mais adequada a um ambiente institucional, voltado a pessoas responsáveis pelo monitoramento e atendimento de ocorrências.

### Principais recursos

- dashboard de monitoramento;
- locais monitorados;
- registro de medições;
- classificação de níveis;
- central de alertas;
- relatórios;
- administração do sistema;
- gráficos e tendências.

### Público mais adequado

- Defesa Civil;
- Bombeiros;
- equipes técnicas;
- operadores do sistema.

---

## v0.2 — Painel Mobile do Cidadão

A segunda linha de prototipação foi criada após a Imersão Profunda.

Seu objetivo é representar a experiência do usuário final em uma interface **mobile-first**, inspirada em aplicações geográficas e meteorológicas.

### Principais recursos demonstrados

- mapa interativo;
- nível de risco da região;
- chuva acumulada;
- nível e tendência de rios;
- linha do tempo com evolução simulada;
- áreas de risco;
- vias afetadas;
- abrigos;
- rota alternativa simulada;
- alertas;
- orientações práticas;
- locais favoritos.

### Tecnologias utilizadas

- **HTML5**
- **CSS3**
- **JavaScript**
- **Leaflet.js**
- **OpenStreetMap**
- **LocalStorage**

> Todos os dados exibidos nesta versão são simulados e utilizados apenas para validação visual e de navegação.

---

# Estrutura do repositório

```text
HidroSentinela/
│
├── Documentação/
│   │
│   ├── Análise de Requisitos/
│   ├── Artigos/
│   ├── Base de conhecimento/
│   ├── Canvas e Swot/
│   │
│   ├── Design Thinking/
│   │   ├── Entendimento/
│   │   ├── Ideação/
│   │   ├── Imersão/
│   │   ├── Mapa Conceitual/
│   │   └── Persona/
│   │
│   └── Protótipo/
│       └── Documentação técnica e registros das versões de prototipação
│
├── Protótipo/
│   │
│   ├── painel operacional/
│   │   └── Protótipo institucional v0.1
│   │
│   └── Painel do usuário/
│       └── HidroSentinela_v0.2_Prototipo_Mobile/
│           └── Protótipo mobile do cidadão
│
└── README.md
```

## Diferença entre as pastas de protótipo

Existem duas pastas com finalidades diferentes:

### `Documentação/Protótipo`

Contém **documentos, especificações, relatórios e registros da evolução dos protótipos**.

### `Protótipo`

Contém os **protótipos executáveis de fato**, incluindo código HTML, CSS e JavaScript.

---

# Fontes de dados previstas

A solução real poderá explorar, conforme disponibilidade técnica e de acesso, dados provenientes de fontes públicas como:

- **CEMADEN** — monitoramento e alertas relacionados a desastres;
- **SGB / SACE** — informações hidrológicas e níveis de rios;
- **INMET** — dados e previsões meteorológicas;
- bases públicas estaduais e municipais;
- registros históricos de ocorrências.

Nesta fase, os protótipos utilizam **dados simulados**.

---

# Visão da solução

A arquitetura conceitual atual prevê duas experiências complementares:

```text
                  FONTES PÚBLICAS
                        │
                        ▼
                 HIDROSENTINELA
                        │
          ┌─────────────┴─────────────┐
          ▼                           ▼
 PAINEL INSTITUCIONAL          EXPERIÊNCIA CIDADÃO
 Monitoramento técnico         Informação simplificada
 Medições                      Risco da região
 Alertas operacionais          Mapa
 Relatórios                    Mobilidade
 Gestão                        Abrigos
                               Orientações
```

O objetivo é que a complexidade dos dados técnicos permaneça disponível para os usuários institucionais, enquanto o cidadão receba uma informação mais simples e útil para sua realidade.

---

# Evolução prevista

## Curto prazo

- refinamento dos protótipos;
- testes de usabilidade;
- validação das principais funcionalidades;
- definição do MVP.

## Médio prazo

- integração com fontes públicas;
- geolocalização;
- notificações;
- histórico por região;
- visualização de vias e áreas afetadas.

## Visão futura

- aplicação mobile completa;
- roteamento seguro;
- integração mais profunda com órgãos públicos;
- análise de dados;
- modelos preditivos e Machine Learning como recursos complementares.

---

# Equipe

- Phablo Escobar Ramos Correia
- Loys Lane Loyola de Aguiar
- Ismailer Gregório Gomes Junior
- Gabriel Gonçalves Rodrigues
- Arthur Cândido Pimentel

---

# Aviso

Este projeto é desenvolvido para fins **acadêmicos e experimentais**.

Os protótipos presentes neste repositório:

- não utilizam dados operacionais em tempo real;
- não emitem alertas oficiais;
- não devem ser utilizados para decisões de emergência;
- não substituem orientações da Defesa Civil ou de outros órgãos competentes.

Em uma situação real de emergência, utilize os canais oficiais.

**Defesa Civil:** 199  
**Corpo de Bombeiros:** 193

---

## Status

**Em desenvolvimento — 2026**

A documentação e os protótipos serão atualizados conforme o avanço das etapas de Design Thinking, definição do MVP e desenvolvimento da solução.
