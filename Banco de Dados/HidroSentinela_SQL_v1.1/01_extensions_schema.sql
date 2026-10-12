-- 01_extensions_schema.sql
-- Execute after connecting to the database hidrosentinela.

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE SCHEMA IF NOT EXISTS hidro;

COMMENT ON SCHEMA hidro IS
'Schema principal do HidroSentinela: geografia, monitoramento, risco, alertas, mobilidade, administracao e integracoes.';
