# HidroSentinela - Protótipo v0.1

> **Painel Operacional / Protótipo demonstrativo**  
> Versão criada no início do projeto, antes da etapa de Design Thinking.

## Visão geral

Este protótipo representa a primeira visão funcional do **HidroSentinela**, um sistema acadêmico voltado ao monitoramento e à análise de riscos relacionados a enchentes e inundações.

A versão `v0.1` foi criada antes das entrevistas com moradores e com a Defesa Civil. Por isso, sua interface é fortemente orientada a **monitoramento técnico e operação**, sendo hoje mais adequada como referência para uma futura experiência institucional destinada a Defesa Civil, Bombeiros, técnicos e administradores.

Após a Imersão Profunda, a experiência voltada ao cidadão passou a ser pensada separadamente, com foco **mobile/mobile-first**, linguagem simplificada, informação localizada e orientações práticas.

## Objetivo desta versão

Demonstrar como uma plataforma pode organizar, em um único painel:

- locais monitorados;
- níveis de água;
- classificação de risco;
- tendência das medições;
- alertas;
- relatórios;
- cadastro de pontos monitorados;
- funções administrativas.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- [Chart.js](https://www.chartjs.org/) para gráficos
- [Font Awesome](https://fontawesome.com/) para ícones

> Todo o protótipo está concentrado em um único arquivo HTML.

## Como executar

1. Baixe o arquivo `hidrosentinela_prototipo_v0.1.html`.
2. Abra o arquivo em um navegador moderno (Chrome, Edge, Firefox etc.).
3. Utilize uma das credenciais de demonstração abaixo.

Não é necessário instalar dependências, banco de dados ou servidor local.

## Credenciais de teste

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador principal | `admin@hidrosentinela.com` | `admin123` |
| Administrador de empresa | `empresa@hidrosentinela.com` | `empresa123` |
| Funcionário/Técnico | `func@hidrosentinela.com` | `func123` |
| Cidadão | `cidadao@hidrosentinela.com` | `cidadao123` |

> **Atenção:** as credenciais são fictícias e estão expostas no código. Esta autenticação existe apenas para demonstração.

## Funcionalidades demonstradas

### Login
- autenticação local simulada;
- perfis com diferentes níveis de acesso.

### Dashboard
- total de locais monitorados;
- locais em situação normal, atenção, alerta e crítica;
- gráfico de evolução dos níveis;
- área reservada para mapa;
- últimas medições;
- alertas recentes.

### Locais monitorados
- cards com nível atual, classificação e tendência;
- cadastro de novos locais para perfis institucionais;
- níveis de referência por local.

### Medições
- listagem do histórico de medições;
- cadastro de nova medição;
- classificação automática do nível medido.

### Central de alertas
- alertas por gravidade;
- nível atual e limite ultrapassado;
- status de atendimento;
- configuração conceitual de e-mail, telefone e tipos de alerta.

### Relatórios
- listagem de relatórios simulados;
- ações conceituais de exportação para PDF e Word;
- configuração de relatórios automáticos.

### Administração
- gerenciamento conceitual de usuários e organizações;
- importação de dados;
- auditoria;
- configuração de alertas;
- backup.

## Classificação de níveis

O protótipo trabalha com as seguintes situações:

- Normal
- Muito baixo
- Atenção
- Alerta
- Crítico
- Transbordamento

A classificação é feita comparando a medição atual com os limites configurados para cada local.

## Tendência

A tendência é calculada comparando a última medição com a anterior e pode ser classificada como:

- subindo rápido;
- subindo;
- estável;
- descendo;
- descendo rápido.

Essa lógica é apenas demonstrativa e **não representa um modelo hidrológico validado**.

## Dados simulados

Esta versão utiliza dados **mock**. Os locais presentes no código são fictícios/demonstrativos e incluem exemplos em diferentes estados brasileiros.

Eles **não representam dados reais do Espírito Santo** e não devem ser utilizados para tomada de decisão.

## Limitações da v0.1

- sem integração real com CEMADEN, SGB/SACE, INMET ou outras fontes;
- sem banco de dados;
- sem API/back-end;
- sem autenticação segura;
- sem mapa funcional;
- sem geolocalização real;
- sem envio real de notificações;
- sem Machine Learning ou previsão de enchentes;
- relatórios e algumas ações são apenas simulados;
- experiência do cidadão ainda excessivamente técnica.

## Evolução após o Design Thinking

A pesquisa com a população e com a Defesa Civil mostrou que o HidroSentinela deve possuir duas experiências complementares:

### HidroSentinela Institucional
Painel web para:

- Defesa Civil;
- Bombeiros;
- técnicos;
- administradores.

Esta versão `v0.1` serve como principal referência inicial para essa frente.

### HidroSentinela Cidadão
Aplicação mobile/mobile-first voltada ao morador, priorizando:

- situação da região do usuário;
- nível de risco em linguagem simples;
- motivo do risco;
- mapa de áreas afetadas;
- vias comprometidas;
- rotas e locais seguros;
- abrigos;
- orientações práticas;
- alertas localizados.

## Status

`Protótipo conceitual / demonstração funcional`

Este código é mantido no repositório como registro da evolução do projeto e como base para o futuro painel institucional do HidroSentinela.

## Próximos passos

- redesenhar a experiência do cidadão em formato mobile;
- integrar dados públicos reais;
- implementar mapa interativo;
- criar back-end e persistência;
- substituir autenticação simulada;
- validar novos fluxos com usuários;
- definir funcionalidades do MVP após priorização de impacto x viabilidade.
