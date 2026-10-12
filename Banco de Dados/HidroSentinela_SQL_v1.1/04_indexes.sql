-- 04_indexes.sql

BEGIN;

-- Geografia
CREATE INDEX idx_municipio_geom
    ON hidro.municipio USING GIST (geom);

CREATE INDEX idx_regiao_geom
    ON hidro.regiao_monitorada USING GIST (geom);

CREATE INDEX idx_regiao_municipio
    ON hidro.regiao_monitorada (id_municipio);

CREATE INDEX idx_ponto_geom
    ON hidro.ponto_monitoramento USING GIST (geom);

CREATE INDEX idx_via_geom
    ON hidro.via USING GIST (geom);

CREATE INDEX idx_abrigo_geom
    ON hidro.abrigo USING GIST (geom);

CREATE INDEX idx_ocorrencia_geom
    ON hidro.ocorrencia USING GIST (geom);

CREATE INDEX idx_alerta_area_geom
    ON hidro.alerta USING GIST (area_geom);

-- Series temporais e historico
CREATE INDEX idx_medicao_observado_em
    ON hidro.medicao (observado_em DESC);

CREATE INDEX idx_medicao_ponto_variavel_tempo
    ON hidro.medicao (id_ponto, id_variavel, observado_em DESC);

CREATE INDEX idx_ocorrencia_municipio_data
    ON hidro.ocorrencia (id_municipio, data_inicio DESC);

CREATE INDEX idx_risco_regiao_data
    ON hidro.risco_regiao (id_regiao, calculado_em DESC);

CREATE INDEX idx_risco_ativo_regiao
    ON hidro.risco_regiao (id_regiao, valido_de DESC)
    WHERE status = 'ATIVO';

CREATE INDEX idx_alerta_emitido_status
    ON hidro.alerta (emitido_em DESC, status);

CREATE INDEX idx_alerta_regiao_regiao
    ON hidro.alerta_regiao (id_regiao, id_alerta);

CREATE INDEX idx_situacao_via_historico
    ON hidro.situacao_via (id_via, inicio_em DESC);

CREATE INDEX idx_situacao_via_status
    ON hidro.situacao_via (status, inicio_em DESC);

CREATE INDEX idx_abrigo_status
    ON hidro.abrigo (status)
    WHERE ativo = TRUE;

-- Integracao
CREATE INDEX idx_dado_bruto_coletado_em
    ON hidro.dado_bruto (coletado_em DESC);

CREATE INDEX idx_dado_bruto_status
    ON hidro.dado_bruto (status_processamento, coletado_em);

CREATE INDEX idx_log_integracao_fonte_inicio
    ON hidro.log_integracao (id_fonte, inicio_em DESC);

-- Administracao
CREATE INDEX idx_administrador_ativo
    ON hidro.administrador (ativo);

CREATE INDEX idx_log_admin_administrador_data
    ON hidro.log_auditoria_admin (id_administrador, criado_em DESC);

CREATE INDEX idx_log_admin_entidade_registro
    ON hidro.log_auditoria_admin (entidade, id_registro);

-- Machine Learning
CREATE INDEX idx_previsao_regiao_alvo
    ON hidro.previsao (id_regiao, previsto_para DESC);

CREATE INDEX idx_previsao_modelo_gerada
    ON hidro.previsao (id_modelo, gerada_em DESC);

COMMIT;
