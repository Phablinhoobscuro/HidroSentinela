# HidroSentinela — Protótipo do Painel do Usuário

Protótipo acadêmico do **HidroSentinela**, uma plataforma para integração, visualização e comunicação de informações relacionadas a enchentes e inundações no Espírito Santo.

Esta versão representa o **painel público voltado ao cidadão**, com foco em consulta rápida, mapa interativo, alertas, informações da região e orientações.

> **Importante:** esta versão utiliza **dados demonstrativos/simulados** e não substitui os canais oficiais da Defesa Civil, CEMADEN, INMET, SGB/SACE ou demais órgãos públicos.

---

## Objetivo do protótipo

O protótipo tem como objetivo validar visualmente e funcionalmente a experiência do usuário final antes da integração com dados reais e com o backend do projeto.

A proposta é permitir que a população consulte, de forma simples e centralizada:

- regiões com diferentes níveis de risco;
- pontos e áreas suscetíveis a alagamentos;
- ruas afetadas;
- alertas;
- informações hidrometeorológicas;
- situação de uma região;
- notícias e orientações;
- informações úteis para prevenção e resposta.

---

## Estado atual

A versão atual já possui:

- aplicação desenvolvida em React;
- TypeScript;
- Vite;
- React Router;
- React Leaflet;
- OpenStreetMap;
- Axios;
- layout responsivo;
- mapa interativo;
- camadas de visualização;
- filtros de alertas;
- filtros de notícias;
- tela de região;
- dados demonstrativos separados em arquivos JSON;
- tratamento de carregamento e falhas;
- fallback local para ruas quando o serviço externo de rotas não responde.

O protótipo já foi executado e testado localmente em ambiente desktop e mobile.

---

## Tecnologias utilizadas

- **React**
- **TypeScript**
- **Vite**
- **React Router**
- **React Leaflet**
- **Leaflet**
- **OpenStreetMap**
- **Axios**
- **CSS responsivo**

---

## Estrutura principal

```text
Painel do usuário/
├── public/
│   └── data/
│       ├── alertas.json
│       ├── clima.json
│       ├── mapa.json
│       ├── noticias.json
│       └── regiao.json
│
├── src/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   └── main.tsx
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

---

## Páginas do protótipo

As principais rotas atuais são:

```text
/app
/app/inicio
/app/mapa
/app/alertas
/app/minha-regiao
/app/noticias
/app/configuracoes
```

A rota `/app` direciona o usuário para a experiência principal baseada no mapa.

---

## Funcionalidades atuais

### Mapa

O mapa exibe informações demonstrativas relacionadas a:

- pontos de alagamento;
- áreas propensas;
- ruas alagadas;
- estações/pontos de referência;
- níveis visuais de risco;
- popups informativos;
- controles de zoom;
- ativação e desativação de camadas.

### Alertas

A tela de alertas permite visualizar e filtrar informações demonstrativas por categoria/status.

### Minha Região

Apresenta informações consolidadas sobre uma região, como:

- situação atual;
- nível de rio;
- previsão;
- risco;
- orientações.

### Notícias

Apresenta conteúdos demonstrativos classificados por categorias.

### Configurações

A tela existe como parte da navegação, porém algumas opções ainda são apenas demonstrativas.

---

## Dados demonstrativos

Nesta etapa, o frontend ainda não está integrado ao banco de dados real.

Os dados são carregados a partir de:

```text
public/data/
```

A arquitetura foi organizada para facilitar a substituição futura dos arquivos JSON por endpoints do backend.

Fluxo atual:

```text
React
  ↓
Services
  ↓
Axios
  ↓
JSONs demonstrativos
```

Fluxo planejado:

```text
React
  ↓
Services
  ↓
API HidroSentinela
  ↓
PostgreSQL + PostGIS
  ↓
Fontes públicas
```

---

## Banco de dados

O banco do HidroSentinela já foi implantado separadamente utilizando:

- PostgreSQL 17;
- PostGIS 3.6.2;
- schema `hidro`;
- 21 tabelas;
- 5 views;
- triggers;
- índices convencionais e espaciais;
- constraints;
- catálogos iniciais de fontes e variáveis ambientais.

O próximo passo será desenvolver a API que ligará este protótipo ao banco.

---

## Sobre cadastro de usuários

O aplicativo público **não exigirá cadastro ou login do cidadão**.

A população deverá acessar o sistema diretamente.

Uma futura área administrativa será separada da aplicação pública e poderá possuir autenticação própria.

---

## Pontos ainda previstos para ajuste

Antes da versão integrada, deverão ser revisados alguns elementos do protótipo:

- remover elementos visuais antigos relacionados a conta/perfil do cidadão;
- substituir indicações de “tempo real” enquanto os dados ainda forem simulados;
- implementar ou revisar a busca;
- ampliar a seleção de regiões;
- integrar dados reais;
- conectar o frontend ao backend;
- ampliar testes de acessibilidade;
- revisar otimizações de build e carregamento.

---

## Como executar

### Pré-requisitos

- Node.js 20.19+ ou 22.12+
- npm

### Instalação

```bash
npm install
```

### Ambiente de desenvolvimento

```bash
npm run dev
```

O Vite normalmente disponibilizará a aplicação em:

```text
http://localhost:5173/
```

### Build

```bash
npm run build
```

### Visualizar build

```bash
npm run preview
```

---

## Testes realizados

Nesta versão foram realizados testes de:

- instalação das dependências;
- auditoria de pacotes;
- compilação TypeScript;
- build Vite;
- inicialização do servidor local;
- carregamento do mapa;
- OpenStreetMap;
- camadas do mapa;
- navegação entre páginas;
- filtros;
- visualização desktop;
- responsividade mobile.

Resultado geral:

```text
Instalação           ✅
Build                ✅
Execução             ✅
Mapa                 ✅
Navegação            ✅
Responsividade       ✅
Erros críticos       0
npm vulnerabilities  0
```

Foi identificado apenas um erro `404` relacionado ao `favicon.ico`, sem impacto funcional.

---

## Observação acadêmica

O HidroSentinela é um projeto acadêmico e experimental desenvolvido no contexto do Projeto Integrador de Extensão da UniSales.

A aplicação não deve ser interpretada como sistema oficial de alerta ou emergência.

Em uma versão futura, informações oficiais deverão apresentar claramente:

- fonte;
- horário de atualização;
- natureza oficial ou experimental;
- período de validade.

---

## Repositório

Projeto completo:

https://github.com/Phablinhoobscuro/HidroSentinela
