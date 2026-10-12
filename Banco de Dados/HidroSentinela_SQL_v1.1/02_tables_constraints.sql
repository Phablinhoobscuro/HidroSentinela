-- 02_tables_constraints.sql

BEGIN;

-- =========================================================
-- 1. BASE GEOGRAFICA E FONTES
-- =========================================================

CREATE TABLE hidro.municipio (
    id_municipio      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo_ibge       VARCHAR(7) NOT NULL UNIQUE,
    nome              VARCHAR(120) NOT NULL,
    uf                CHAR(2) NOT NULL DEFAULT 'ES',
    geom              geometry(MultiPolygon, 4326),
    ativo             BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT ck_municipio_codigo_ibge
        CHECK (codigo_ibge ~ '^[0-9]{7}$'),

    CONSTRAINT ck_municipio_geom_valida
        CHECK (geom IS NULL OR (NOT ST_IsEmpty(geom) AND ST_IsValid(geom)))
);

COMMENT ON TABLE hidro.municipio IS
'Municipios utilizados pelo HidroSentinela. A carga inicial deve priorizar os municipios do Espirito Santo.';

CREATE TABLE hidro.regiao_monitorada (
    id_regiao         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_municipio      BIGINT NOT NULL,
    id_regiao_pai     BIGINT,
    nome              VARCHAR(160) NOT NULL,
    tipo_regiao       VARCHAR(30) NOT NULL,
    codigo_externo    VARCHAR(100),
    geom              geometry(MultiPolygon, 4326) NOT NULL,
    descricao         TEXT,
    ativo             BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_regiao_municipio
        FOREIGN KEY (id_municipio)
        REFERENCES hidro.municipio(id_municipio)
        ON DELETE RESTRICT,

    CONSTRAINT fk_regiao_pai
        FOREIGN KEY (id_regiao_pai)
        REFERENCES hidro.regiao_monitorada(id_regiao)
        ON DELETE SET NULL,

    CONSTRAINT ck_regiao_tipo
        CHECK (tipo_regiao IN ('BAIRRO', 'AREA_RISCO', 'SETOR', 'BACIA', 'CUSTOMIZADA')),

    CONSTRAINT ck_regiao_nao_auto_referencia
        CHECK (id_regiao_pai IS NULL OR id_regiao_pai <> id_regiao),

    CONSTRAINT ck_regiao_geom_valida
        CHECK (NOT ST_IsEmpty(geom) AND ST_IsValid(geom))
);

COMMENT ON TABLE hidro.regiao_monitorada IS
'Areas utilizadas para consulta, mapa, classificacao de risco e relacionamento com dados locais.';

CREATE TABLE hidro.fonte_dados (
    id_fonte                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome                      VARCHAR(180) NOT NULL,
    sigla                     VARCHAR(30) UNIQUE,
    tipo_fonte                VARCHAR(30) NOT NULL,
    url_base                  TEXT,
    descricao                 TEXT,
    oficial                   BOOLEAN NOT NULL DEFAULT FALSE,
    cadencia_minutos          INTEGER,
    fuso_origem               VARCHAR(60),
    ativo                     BOOLEAN NOT NULL DEFAULT TRUE,
    ultima_coleta_sucesso_em  TIMESTAMPTZ,

    CONSTRAINT ck_fonte_tipo
        CHECK (tipo_fonte IN ('API', 'ARQUIVO', 'SERVICO_GEO', 'MANUAL', 'INTERNA')),

    CONSTRAINT ck_fonte_cadencia
        CHECK (cadencia_minutos IS NULL OR cadencia_minutos > 0)
);

COMMENT ON TABLE hidro.fonte_dados IS
'Catalogo de fontes oficiais, externas ou internas consumidas pelo HidroSentinela.';

-- =========================================================
-- 2. INTEGRACAO E AUDITORIA
-- =========================================================

CREATE TABLE hidro.dado_bruto (
    id_dado_bruto          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_fonte               BIGINT NOT NULL,
    identificador_externo  VARCHAR(200),
    recurso_origem         TEXT,
    coletado_em            TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    referencia_em          TIMESTAMPTZ,
    payload                JSONB NOT NULL,
    hash_payload           CHAR(64) NOT NULL,
    status_processamento   VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    processado_em          TIMESTAMPTZ,
    erro_processamento     TEXT,

    CONSTRAINT fk_dado_bruto_fonte
        FOREIGN KEY (id_fonte)
        REFERENCES hidro.fonte_dados(id_fonte)
        ON DELETE RESTRICT,

    CONSTRAINT uq_dado_bruto_fonte_hash
        UNIQUE (id_fonte, hash_payload),

    CONSTRAINT ck_dado_bruto_hash
        CHECK (hash_payload ~ '^[0-9A-Fa-f]{64}$'),

    CONSTRAINT ck_dado_bruto_status
        CHECK (status_processamento IN ('PENDENTE', 'PROCESSADO', 'ERRO', 'IGNORADO')),

    CONSTRAINT ck_dado_bruto_processamento
        CHECK (
            (status_processamento = 'PENDENTE' AND processado_em IS NULL)
            OR
            (status_processamento IN ('PROCESSADO', 'ERRO', 'IGNORADO') AND processado_em IS NOT NULL)
        )
);

COMMENT ON TABLE hidro.dado_bruto IS
'Camada de staging/auditoria. Preserva o payload original recebido de cada fonte para deduplicacao e reprocessamento.';

CREATE TABLE hidro.log_integracao (
    id_log                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_fonte               BIGINT NOT NULL,
    job_nome               VARCHAR(120) NOT NULL,
    inicio_em              TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fim_em                 TIMESTAMPTZ,
    status                 VARCHAR(20) NOT NULL DEFAULT 'EXECUTANDO',
    registros_recebidos    INTEGER NOT NULL DEFAULT 0,
    registros_processados  INTEGER NOT NULL DEFAULT 0,
    registros_erro         INTEGER NOT NULL DEFAULT 0,
    mensagem_erro          TEXT,
    detalhes               JSONB,

    CONSTRAINT fk_log_fonte
        FOREIGN KEY (id_fonte)
        REFERENCES hidro.fonte_dados(id_fonte)
        ON DELETE RESTRICT,

    CONSTRAINT ck_log_status
        CHECK (status IN ('EXECUTANDO', 'SUCESSO', 'PARCIAL', 'ERRO')),

    CONSTRAINT ck_log_contadores
        CHECK (
            registros_recebidos >= 0
            AND registros_processados >= 0
            AND registros_erro >= 0
        ),

    CONSTRAINT ck_log_periodo
        CHECK (fim_em IS NULL OR fim_em >= inicio_em)
);

COMMENT ON TABLE hidro.log_integracao IS
'Historico de execucao dos coletores e jobs de integracao.';

-- =========================================================
-- 3. MONITORAMENTO HIDROMETEOROLOGICO
-- =========================================================

CREATE TABLE hidro.ponto_monitoramento (
    id_ponto        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_fonte        BIGINT NOT NULL,
    id_regiao       BIGINT,
    codigo_externo  VARCHAR(120) NOT NULL,
    nome            VARCHAR(180) NOT NULL,
    tipo_ponto      VARCHAR(30) NOT NULL,
    geom            geometry(Point, 4326) NOT NULL,
    altitude_m      NUMERIC(8,2),
    metadados       JSONB,
    ativo           BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_ponto_fonte
        FOREIGN KEY (id_fonte)
        REFERENCES hidro.fonte_dados(id_fonte)
        ON DELETE RESTRICT,

    CONSTRAINT fk_ponto_regiao
        FOREIGN KEY (id_regiao)
        REFERENCES hidro.regiao_monitorada(id_regiao)
        ON DELETE SET NULL,

    CONSTRAINT uq_ponto_fonte_codigo
        UNIQUE (id_fonte, codigo_externo),

    CONSTRAINT ck_ponto_tipo
        CHECK (tipo_ponto IN ('PLUVIOMETRO', 'FLUVIOMETRICO', 'METEOROLOGICO', 'OUTRO')),

    CONSTRAINT ck_ponto_geom_valida
        CHECK (NOT ST_IsEmpty(geom) AND ST_IsValid(geom))
);

COMMENT ON TABLE hidro.ponto_monitoramento IS
'Estacoes e pontos de monitoramento provenientes de INMET, CEMADEN, SGB/SACE ou outras fontes homologadas.';

CREATE TABLE hidro.tipo_variavel (
    id_variavel             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo                  VARCHAR(50) NOT NULL UNIQUE,
    nome                    VARCHAR(160) NOT NULL,
    categoria               VARCHAR(40) NOT NULL,
    unidade                 VARCHAR(30) NOT NULL,
    periodo_referencia_min  INTEGER,
    descricao               TEXT,
    ativo                   BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT ck_variavel_periodo
        CHECK (periodo_referencia_min IS NULL OR periodo_referencia_min > 0)
);

COMMENT ON TABLE hidro.tipo_variavel IS
'Catalogo canonico das variaveis ambientais armazenadas em medicao.';

CREATE TABLE hidro.medicao (
    id_medicao         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_ponto           BIGINT NOT NULL,
    id_variavel        BIGINT NOT NULL,
    id_dado_bruto      BIGINT,
    valor              NUMERIC(18,6) NOT NULL,
    observado_em       TIMESTAMPTZ NOT NULL,
    recebido_em        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    qualidade          VARCHAR(20) NOT NULL DEFAULT 'BRUTO',
    qualidade_detalhe  TEXT,
    revisao            INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT fk_medicao_ponto
        FOREIGN KEY (id_ponto)
        REFERENCES hidro.ponto_monitoramento(id_ponto)
        ON DELETE RESTRICT,

    CONSTRAINT fk_medicao_variavel
        FOREIGN KEY (id_variavel)
        REFERENCES hidro.tipo_variavel(id_variavel)
        ON DELETE RESTRICT,

    CONSTRAINT fk_medicao_dado_bruto
        FOREIGN KEY (id_dado_bruto)
        REFERENCES hidro.dado_bruto(id_dado_bruto)
        ON DELETE RESTRICT,

    CONSTRAINT uq_medicao_serie
        UNIQUE (id_ponto, id_variavel, observado_em),

    CONSTRAINT ck_medicao_qualidade
        CHECK (qualidade IN ('BRUTO', 'VALIDADO', 'SUSPEITO', 'INVALIDO')),

    CONSTRAINT ck_medicao_revisao
        CHECK (revisao >= 1)
);

COMMENT ON TABLE hidro.medicao IS
'Serie temporal normalizada de observacoes hidrometeorologicas.';

-- =========================================================
-- 4. HISTORICO DE DESASTRES
-- =========================================================

CREATE TABLE hidro.ocorrencia (
    id_ocorrencia       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_fonte            BIGINT NOT NULL,
    id_municipio        BIGINT NOT NULL,
    id_dado_bruto       BIGINT,
    codigo_externo      VARCHAR(120),
    tipo_ocorrencia     VARCHAR(40) NOT NULL,
    data_inicio         TIMESTAMPTZ NOT NULL,
    data_fim            TIMESTAMPTZ,
    severidade          VARCHAR(30),
    descricao           TEXT,
    danos_humanos       JSONB,
    danos_materiais     JSONB,
    geom                geometry(Geometry, 4326),

    CONSTRAINT fk_ocorrencia_fonte
        FOREIGN KEY (id_fonte)
        REFERENCES hidro.fonte_dados(id_fonte)
        ON DELETE RESTRICT,

    CONSTRAINT fk_ocorrencia_municipio
        FOREIGN KEY (id_municipio)
        REFERENCES hidro.municipio(id_municipio)
        ON DELETE RESTRICT,

    CONSTRAINT fk_ocorrencia_dado_bruto
        FOREIGN KEY (id_dado_bruto)
        REFERENCES hidro.dado_bruto(id_dado_bruto)
        ON DELETE RESTRICT,

    CONSTRAINT ck_ocorrencia_tipo
        CHECK (tipo_ocorrencia IN (
            'ENCHENTE', 'INUNDACAO', 'ALAGAMENTO', 'ENXURRADA',
            'CHUVA_INTENSA', 'OUTRO'
        )),

    CONSTRAINT ck_ocorrencia_periodo
        CHECK (data_fim IS NULL OR data_fim >= data_inicio),

    CONSTRAINT ck_ocorrencia_geom_valida
        CHECK (geom IS NULL OR (NOT ST_IsEmpty(geom) AND ST_IsValid(geom)))
);

COMMENT ON TABLE hidro.ocorrencia IS
'Historico de desastres e ocorrencias, com prioridade para registros S2ID/Atlas Digital e fontes oficiais locais.';

-- =========================================================
-- 5. RISCO E EXPLICABILIDADE
-- =========================================================

CREATE TABLE hidro.risco_regiao (
    id_risco           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_regiao          BIGINT NOT NULL,
    id_fonte           BIGINT NOT NULL,
    nivel              VARCHAR(20) NOT NULL,
    origem_calculo     VARCHAR(30) NOT NULL,
    calculado_em       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valido_de          TIMESTAMPTZ NOT NULL,
    valido_ate         TIMESTAMPTZ,
    confianca          NUMERIC(5,4),
    descricao_publica  TEXT,
    status             VARCHAR(20) NOT NULL DEFAULT 'ATIVO',

    CONSTRAINT fk_risco_regiao
        FOREIGN KEY (id_regiao)
        REFERENCES hidro.regiao_monitorada(id_regiao)
        ON DELETE RESTRICT,

    CONSTRAINT fk_risco_fonte
        FOREIGN KEY (id_fonte)
        REFERENCES hidro.fonte_dados(id_fonte)
        ON DELETE RESTRICT,

    CONSTRAINT ck_risco_nivel
        CHECK (nivel IN ('BAIXO', 'MODERADO', 'ALTO', 'MUITO_ALTO')),

    CONSTRAINT ck_risco_origem
        CHECK (origem_calculo IN ('OFICIAL', 'REGRA', 'MANUAL', 'MODELO_EXPERIMENTAL')),

    CONSTRAINT ck_risco_confianca
        CHECK (confianca IS NULL OR (confianca >= 0 AND confianca <= 1)),

    CONSTRAINT ck_risco_status
        CHECK (status IN ('ATIVO', 'EXPIRADO', 'CANCELADO')),

    CONSTRAINT ck_risco_validade
        CHECK (valido_ate IS NULL OR valido_ate >= valido_de)
);

COMMENT ON TABLE hidro.risco_regiao IS
'Historico de classificacoes de risco por regiao, preservando origem oficial, manual, por regra ou modelo experimental.';

CREATE TABLE hidro.fator_risco (
    id_fator            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_risco            BIGINT NOT NULL,
    id_variavel         BIGINT,
    tipo_fator          VARCHAR(40) NOT NULL,
    nome                VARCHAR(160) NOT NULL,
    valor_observado     NUMERIC(18,6),
    unidade_exibicao    VARCHAR(30),
    peso                NUMERIC(8,5),
    descricao_publica   TEXT NOT NULL,
    ordem_exibicao      SMALLINT NOT NULL DEFAULT 1,

    CONSTRAINT fk_fator_risco
        FOREIGN KEY (id_risco)
        REFERENCES hidro.risco_regiao(id_risco)
        ON DELETE CASCADE,

    CONSTRAINT fk_fator_variavel
        FOREIGN KEY (id_variavel)
        REFERENCES hidro.tipo_variavel(id_variavel)
        ON DELETE SET NULL,

    CONSTRAINT ck_fator_tipo
        CHECK (tipo_fator IN ('MEDICAO', 'HISTORICO', 'PREVISAO', 'OFICIAL', 'OUTRO')),

    CONSTRAINT ck_fator_ordem
        CHECK (ordem_exibicao >= 0)
);

COMMENT ON TABLE hidro.fator_risco IS
'Fatores utilizados para explicar em linguagem simples por que uma regiao recebeu determinada classificacao de risco.';

-- =========================================================
-- 6. ALERTAS E ORIENTACOES
-- =========================================================

CREATE TABLE hidro.alerta (
    id_alerta           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_fonte            BIGINT NOT NULL,
    id_risco            BIGINT,
    id_dado_bruto       BIGINT,
    codigo_externo      VARCHAR(150),
    tipo_alerta         VARCHAR(30) NOT NULL,
    nivel               VARCHAR(20),
    titulo              VARCHAR(180) NOT NULL,
    mensagem            TEXT NOT NULL,
    orientacao_resumo   TEXT,
    emitido_em          TIMESTAMPTZ NOT NULL,
    valido_ate          TIMESTAMPTZ,
    oficial             BOOLEAN NOT NULL DEFAULT FALSE,
    status              VARCHAR(20) NOT NULL DEFAULT 'ATIVO',
    area_geom           geometry(Geometry, 4326),

    CONSTRAINT fk_alerta_fonte
        FOREIGN KEY (id_fonte)
        REFERENCES hidro.fonte_dados(id_fonte)
        ON DELETE RESTRICT,

    CONSTRAINT fk_alerta_risco
        FOREIGN KEY (id_risco)
        REFERENCES hidro.risco_regiao(id_risco)
        ON DELETE SET NULL,

    CONSTRAINT fk_alerta_dado_bruto
        FOREIGN KEY (id_dado_bruto)
        REFERENCES hidro.dado_bruto(id_dado_bruto)
        ON DELETE RESTRICT,

    CONSTRAINT ck_alerta_tipo
        CHECK (tipo_alerta IN ('INFORMATIVO', 'ATENCAO', 'ALERTA', 'EMERGENCIA')),

    CONSTRAINT ck_alerta_nivel
        CHECK (nivel IS NULL OR nivel IN ('BAIXO', 'MODERADO', 'ALTO', 'MUITO_ALTO')),

    CONSTRAINT ck_alerta_status
        CHECK (status IN ('ATIVO', 'EXPIRADO', 'CANCELADO')),

    CONSTRAINT ck_alerta_validade
        CHECK (valido_ate IS NULL OR valido_ate >= emitido_em),

    CONSTRAINT ck_alerta_geom_valida
        CHECK (area_geom IS NULL OR (NOT ST_IsEmpty(area_geom) AND ST_IsValid(area_geom)))
);

COMMENT ON TABLE hidro.alerta IS
'Alertas oficiais ou informativos. O campo oficial diferencia comunicados institucionais de mensagens internas do HidroSentinela.';

CREATE TABLE hidro.alerta_regiao (
    id_alerta   BIGINT NOT NULL,
    id_regiao   BIGINT NOT NULL,
    principal   BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT pk_alerta_regiao
        PRIMARY KEY (id_alerta, id_regiao),

    CONSTRAINT fk_alerta_regiao_alerta
        FOREIGN KEY (id_alerta)
        REFERENCES hidro.alerta(id_alerta)
        ON DELETE CASCADE,

    CONSTRAINT fk_alerta_regiao_regiao
        FOREIGN KEY (id_regiao)
        REFERENCES hidro.regiao_monitorada(id_regiao)
        ON DELETE RESTRICT
);

COMMENT ON TABLE hidro.alerta_regiao IS
'Relacionamento N:N entre alertas e regioes monitoradas.';

CREATE TABLE hidro.orientacao (
    id_orientacao     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nivel_risco       VARCHAR(20),
    fase_evento       VARCHAR(20) NOT NULL,
    publico           VARCHAR(30) NOT NULL DEFAULT 'GERAL',
    titulo            VARCHAR(180) NOT NULL,
    descricao         TEXT NOT NULL,
    fonte_referencia  TEXT,
    ordem_exibicao    SMALLINT NOT NULL DEFAULT 1,
    ativo             BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT ck_orientacao_nivel
        CHECK (nivel_risco IS NULL OR nivel_risco IN ('BAIXO', 'MODERADO', 'ALTO', 'MUITO_ALTO')),

    CONSTRAINT ck_orientacao_fase
        CHECK (fase_evento IN ('ANTES', 'DURANTE', 'DEPOIS', 'GERAL')),

    CONSTRAINT ck_orientacao_publico
        CHECK (publico IN ('GERAL', 'CRIANCAS', 'IDOSOS', 'ANIMAIS', 'PCD', 'OUTRO')),

    CONSTRAINT ck_orientacao_ordem
        CHECK (ordem_exibicao >= 0)
);

COMMENT ON TABLE hidro.orientacao IS
'Conteudo orientativo exibido ao cidadao. O conteudo deve ter fonte de referencia quando derivado de orientacao oficial.';

-- =========================================================
-- 7. MOBILIDADE E PONTOS SEGUROS
-- =========================================================

CREATE TABLE hidro.via (
    id_via          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_municipio    BIGINT NOT NULL,
    codigo_externo  VARCHAR(150),
    nome            VARCHAR(220) NOT NULL,
    tipo_via        VARCHAR(40),
    geom            geometry(LineString, 4326) NOT NULL,
    ativo           BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_via_municipio
        FOREIGN KEY (id_municipio)
        REFERENCES hidro.municipio(id_municipio)
        ON DELETE RESTRICT,

    CONSTRAINT ck_via_geom_valida
        CHECK (NOT ST_IsEmpty(geom) AND ST_IsValid(geom))
);

COMMENT ON TABLE hidro.via IS
'Segmentos de vias utilizados para visualizacao de mobilidade e condicoes de trafego associadas a enchentes.';

CREATE TABLE hidro.situacao_via (
    id_situacao_via  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_via           BIGINT NOT NULL,
    id_fonte         BIGINT NOT NULL,
    id_dado_bruto    BIGINT,
    status            VARCHAR(20) NOT NULL,
    inicio_em         TIMESTAMPTZ NOT NULL,
    fim_previsto_em  TIMESTAMPTZ,
    fim_em            TIMESTAMPTZ,
    descricao         TEXT,
    confirmado        BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_situacao_via
        FOREIGN KEY (id_via)
        REFERENCES hidro.via(id_via)
        ON DELETE RESTRICT,

    CONSTRAINT fk_situacao_fonte
        FOREIGN KEY (id_fonte)
        REFERENCES hidro.fonte_dados(id_fonte)
        ON DELETE RESTRICT,

    CONSTRAINT fk_situacao_dado_bruto
        FOREIGN KEY (id_dado_bruto)
        REFERENCES hidro.dado_bruto(id_dado_bruto)
        ON DELETE RESTRICT,

    CONSTRAINT ck_situacao_status
        CHECK (status IN ('NORMAL', 'ATENCAO', 'ALAGADA', 'INTERDITADA', 'LIBERADA')),

    CONSTRAINT ck_situacao_periodo_previsto
        CHECK (fim_previsto_em IS NULL OR fim_previsto_em >= inicio_em),

    CONSTRAINT ck_situacao_periodo_real
        CHECK (fim_em IS NULL OR fim_em >= inicio_em)
);

COMMENT ON TABLE hidro.situacao_via IS
'Historico das condicoes de cada trecho de via. A via e permanente; sua situacao varia no tempo.';

CREATE TABLE hidro.abrigo (
    id_abrigo               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_municipio            BIGINT NOT NULL,
    id_regiao               BIGINT,
    id_fonte                BIGINT NOT NULL,
    nome                    VARCHAR(200) NOT NULL,
    endereco                TEXT,
    geom                    geometry(Point, 4326) NOT NULL,
    capacidade              INTEGER,
    status                  VARCHAR(20) NOT NULL DEFAULT 'DESCONHECIDO',
    telefone                VARCHAR(40),
    status_atualizado_em    TIMESTAMPTZ,
    ativo                   BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_abrigo_municipio
        FOREIGN KEY (id_municipio)
        REFERENCES hidro.municipio(id_municipio)
        ON DELETE RESTRICT,

    CONSTRAINT fk_abrigo_regiao
        FOREIGN KEY (id_regiao)
        REFERENCES hidro.regiao_monitorada(id_regiao)
        ON DELETE SET NULL,

    CONSTRAINT fk_abrigo_fonte
        FOREIGN KEY (id_fonte)
        REFERENCES hidro.fonte_dados(id_fonte)
        ON DELETE RESTRICT,

    CONSTRAINT ck_abrigo_capacidade
        CHECK (capacidade IS NULL OR capacidade >= 0),

    CONSTRAINT ck_abrigo_status
        CHECK (status IN ('DISPONIVEL', 'LOTADO', 'FECHADO', 'DESCONHECIDO')),

    CONSTRAINT ck_abrigo_geom_valida
        CHECK (NOT ST_IsEmpty(geom) AND ST_IsValid(geom))
);

COMMENT ON TABLE hidro.abrigo IS
'Pontos seguros e abrigos provenientes de fontes oficiais ou cadastros institucionais validados.';

-- =========================================================
-- 8. ADMINISTRACAO DA PLATAFORMA
-- =========================================================

CREATE TABLE hidro.administrador (
    id_administrador   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome               VARCHAR(160) NOT NULL,
    email              VARCHAR(254) NOT NULL UNIQUE,
    senha_hash         TEXT NOT NULL,
    criado_em          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso_em   TIMESTAMPTZ,
    ativo              BOOLEAN NOT NULL DEFAULT TRUE
);

COMMENT ON TABLE hidro.administrador IS
'Contas exclusivas da interface administrativa. O aplicativo publico do cidadao nao exige cadastro ou autenticacao.';

CREATE TABLE hidro.log_auditoria_admin (
    id_log_admin       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_administrador   BIGINT NOT NULL,
    acao               VARCHAR(40) NOT NULL,
    entidade           VARCHAR(100) NOT NULL,
    id_registro        BIGINT,
    detalhes           JSONB,
    ip_origem          INET,
    user_agent         TEXT,
    criado_em          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_log_admin_administrador
        FOREIGN KEY (id_administrador)
        REFERENCES hidro.administrador(id_administrador)
        ON DELETE RESTRICT,

    CONSTRAINT ck_log_admin_acao
        CHECK (acao IN ('LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'IMPORT', 'EXPORT', 'PUBLICAR', 'DESPUBLICAR', 'OUTRO'))
);

COMMENT ON TABLE hidro.log_auditoria_admin IS
'Trilha de auditoria das operacoes executadas na interface administrativa separada do aplicativo publico.';

-- =========================================================
-- 9. MACHINE LEARNING - MODULO FUTURO
-- =========================================================

CREATE TABLE hidro.modelo_ml (
    id_modelo             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome                  VARCHAR(160) NOT NULL,
    versao                VARCHAR(50) NOT NULL,
    algoritmo             VARCHAR(120) NOT NULL,
    variaveis_entrada     JSONB NOT NULL,
    treinado_em           TIMESTAMPTZ NOT NULL,
    periodo_treino_inicio TIMESTAMPTZ,
    periodo_treino_fim    TIMESTAMPTZ,
    metricas              JSONB NOT NULL,
    artefato_uri          TEXT,
    ativo                 BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT uq_modelo_nome_versao
        UNIQUE (nome, versao),

    CONSTRAINT ck_modelo_periodo
        CHECK (
            periodo_treino_fim IS NULL
            OR periodo_treino_inicio IS NULL
            OR periodo_treino_fim >= periodo_treino_inicio
        )
);

COMMENT ON TABLE hidro.modelo_ml IS
'Catalogo de versoes de modelos experimentais. O nucleo operacional do banco nao depende desta tabela.';

CREATE TABLE hidro.previsao (
    id_previsao        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_modelo          BIGINT NOT NULL,
    id_regiao          BIGINT NOT NULL,
    gerada_em          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    referencia_em      TIMESTAMPTZ NOT NULL,
    horizonte_minutos  INTEGER NOT NULL,
    previsto_para      TIMESTAMPTZ NOT NULL,
    nivel_previsto     VARCHAR(20) NOT NULL,
    probabilidade      NUMERIC(5,4),
    explicabilidade    JSONB,
    publicavel         BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_previsao_modelo
        FOREIGN KEY (id_modelo)
        REFERENCES hidro.modelo_ml(id_modelo)
        ON DELETE RESTRICT,

    CONSTRAINT fk_previsao_regiao
        FOREIGN KEY (id_regiao)
        REFERENCES hidro.regiao_monitorada(id_regiao)
        ON DELETE RESTRICT,

    CONSTRAINT ck_previsao_horizonte
        CHECK (horizonte_minutos > 0),

    CONSTRAINT ck_previsao_nivel
        CHECK (nivel_previsto IN ('BAIXO', 'MODERADO', 'ALTO', 'MUITO_ALTO')),

    CONSTRAINT ck_previsao_probabilidade
        CHECK (probabilidade IS NULL OR (probabilidade >= 0 AND probabilidade <= 1)),

    CONSTRAINT ck_previsao_instante
        CHECK (previsto_para >= referencia_em)
);

COMMENT ON TABLE hidro.previsao IS
'Resultados de previsoes experimentais produzidas por versoes registradas em modelo_ml.';

COMMIT;
