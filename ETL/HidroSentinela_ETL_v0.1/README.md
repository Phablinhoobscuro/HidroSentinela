# HidroSentinela ETL — v0.1

Primeira estrutura de ETL do HidroSentinela. O objetivo é substituir progressivamente os dados demonstrativos do frontend por dados coletados, preservados e normalizados no PostgreSQL/PostGIS.

## Arquitetura

```text
Fonte pública
   ↓ Extract
payload original
   ↓
hidro.dado_bruto + hidro.log_integracao
   ↓ Transform / Load
ponto_monitoramento / medicao / ocorrencia / via / risco / alerta
   ↓
API HidroSentinela
   ↓
React
```

A ETL **não grava JSONs dentro do frontend**. O frontend deverá futuramente consumir a API.

## Primeiro job implementado

`sgb-sace-stations`

Coleta o catálogo público de estações da camada SACE do Geoportal do Serviço Geológico do Brasil, preserva o GeoJSON em `hidro.dado_bruto`, registra a execução em `hidro.log_integracao` e realiza upsert em `hidro.ponto_monitoramento`.

A primeira versão usa um `bbox` aproximado do Espírito Santo configurável no `.env`. Quando as geometrias territoriais oficiais estiverem carregadas, a associação espacial será feita pelo PostGIS.

## Instalação

No Windows/PowerShell:

```powershell
cd ETL
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .
Copy-Item .env.example .env
```

Edite `.env` e informe `DB_PASSWORD`.

## Executar

```powershell
python -m hidrosentinela_etl sgb-sace-stations
```

## Validar

```sql
SELECT *
FROM hidro.log_integracao
ORDER BY id_log DESC
LIMIT 10;

SELECT p.id_ponto, f.sigla, p.codigo_externo, p.nome,
       ST_Y(p.geom) AS latitude,
       ST_X(p.geom) AS longitude
FROM hidro.ponto_monitoramento p
JOIN hidro.fonte_dados f ON f.id_fonte = p.id_fonte
WHERE f.sigla = 'SGB/SACE'
ORDER BY p.nome;

SELECT id_dado_bruto, id_fonte, coletado_em, status_processamento, recurso_origem
FROM hidro.dado_bruto
ORDER BY id_dado_bruto DESC
LIMIT 10;
```

## Próximos jobs

1. Carga geográfica oficial (municípios/regiões).
2. INMET — catálogo de estações e medições meteorológicas.
3. SGB/SACE — séries de nível/vazão quando a interface de medição for homologada.
4. S2ID/Atlas — histórico de desastres.
5. CEMADEN — precipitação, conforme interface oficial disponível.
6. Processamento de riscos e geração de alertas internos.

## Observação sobre o frontend atual

Os arquivos `public/data/*.json` continuam apenas como dados demonstrativos. Eles serão substituídos gradualmente por endpoints da API; não são a fonte da ETL de produção.
