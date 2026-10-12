-- 06_views_utilitarias.sql

BEGIN;
-- Views recomendadas para simplificar consultas da API.

CREATE OR REPLACE VIEW hidro.vw_ultima_medicao AS
SELECT DISTINCT ON (m.id_ponto, m.id_variavel)
       m.id_medicao,
       m.id_ponto,
       p.nome AS ponto_nome,
       m.id_variavel,
       v.codigo AS variavel_codigo,
       v.nome AS variavel_nome,
       v.unidade,
       m.valor,
       m.observado_em,
       m.recebido_em,
       m.qualidade
FROM hidro.medicao m
JOIN hidro.ponto_monitoramento p
  ON p.id_ponto = m.id_ponto
JOIN hidro.tipo_variavel v
  ON v.id_variavel = m.id_variavel
ORDER BY m.id_ponto, m.id_variavel, m.observado_em DESC;

CREATE OR REPLACE VIEW hidro.vw_risco_atual AS
SELECT DISTINCT ON (r.id_regiao)
       r.id_risco,
       r.id_regiao,
       rg.nome AS regiao_nome,
       r.id_fonte,
       f.sigla AS fonte_sigla,
       r.nivel,
       r.origem_calculo,
       r.calculado_em,
       r.valido_de,
       r.valido_ate,
       r.confianca,
       r.descricao_publica,
       r.status
FROM hidro.risco_regiao r
JOIN hidro.regiao_monitorada rg
  ON rg.id_regiao = r.id_regiao
JOIN hidro.fonte_dados f
  ON f.id_fonte = r.id_fonte
WHERE r.status = 'ATIVO'
  AND r.valido_de <= CURRENT_TIMESTAMP
  AND (r.valido_ate IS NULL OR r.valido_ate >= CURRENT_TIMESTAMP)
ORDER BY r.id_regiao, r.calculado_em DESC;

CREATE OR REPLACE VIEW hidro.vw_situacao_via_atual AS
SELECT DISTINCT ON (s.id_via)
       s.id_situacao_via,
       s.id_via,
       v.nome AS via_nome,
       v.id_municipio,
       s.id_fonte,
       f.sigla AS fonte_sigla,
       s.status,
       s.inicio_em,
       s.fim_previsto_em,
       s.fim_em,
       s.descricao,
       s.confirmado
FROM hidro.situacao_via s
JOIN hidro.via v
  ON v.id_via = s.id_via
JOIN hidro.fonte_dados f
  ON f.id_fonte = s.id_fonte
ORDER BY s.id_via, s.inicio_em DESC;

CREATE OR REPLACE VIEW hidro.vw_alertas_ativos AS
SELECT
    a.id_alerta,
    a.id_fonte,
    f.sigla AS fonte_sigla,
    a.id_risco,
    a.tipo_alerta,
    a.nivel,
    a.titulo,
    a.mensagem,
    a.orientacao_resumo,
    a.emitido_em,
    a.valido_ate,
    a.oficial,
    a.area_geom
FROM hidro.alerta a
JOIN hidro.fonte_dados f
  ON f.id_fonte = a.id_fonte
WHERE a.status = 'ATIVO'
  AND (a.valido_ate IS NULL OR a.valido_ate >= CURRENT_TIMESTAMP);

CREATE OR REPLACE VIEW hidro.vw_abrigos_disponiveis AS
SELECT
    a.id_abrigo,
    a.id_municipio,
    m.nome AS municipio_nome,
    a.id_regiao,
    a.nome,
    a.endereco,
    a.geom,
    a.capacidade,
    a.status,
    a.telefone,
    a.status_atualizado_em
FROM hidro.abrigo a
JOIN hidro.municipio m
  ON m.id_municipio = a.id_municipio
WHERE a.ativo = TRUE
  AND a.status = 'DISPONIVEL';

COMMIT;
