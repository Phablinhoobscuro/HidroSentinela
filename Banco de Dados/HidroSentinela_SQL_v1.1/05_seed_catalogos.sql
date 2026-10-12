-- 05_seed_catalogos.sql

BEGIN;
-- Carga inicial de catalogos. URLs e cadencias devem ser ajustadas
-- apos a homologacao tecnica de cada interface de coleta.

INSERT INTO hidro.fonte_dados
    (nome, sigla, tipo_fonte, descricao, oficial, ativo)
VALUES
    ('Instituto Brasileiro de Geografia e Estatistica', 'IBGE', 'ARQUIVO',
     'Limites municipais, codigos e outros dados geograficos oficiais.', TRUE, TRUE),
    ('Instituto Nacional de Meteorologia', 'INMET', 'API',
     'Estacoes e observacoes meteorologicas.', TRUE, TRUE),
    ('Centro Nacional de Monitoramento e Alertas de Desastres Naturais', 'CEMADEN', 'ARQUIVO',
     'Monitoramento e series de precipitacao. O tipo deve ser ajustado se uma interface automatizada oficial for homologada.', TRUE, TRUE),
    ('Servico Geologico do Brasil / Sistema de Alerta de Eventos Criticos', 'SGB/SACE', 'SERVICO_GEO',
     'Estacoes hidrologicas, niveis de rios, vazao, chuva e metadados. O mecanismo definitivo de coleta deve ser homologado.', TRUE, TRUE),
    ('Sistema Integrado de Informacoes sobre Desastres / Atlas Digital', 'S2ID/ATLAS', 'ARQUIVO',
     'Historico de desastres e ocorrencias registradas.', TRUE, TRUE),
    ('Defesa Civil / Prefeituras', 'DEFESA_CIVIL', 'MANUAL',
     'Areas de risco, abrigos, vias afetadas, alertas e orientacoes quando disponibilizados.', TRUE, TRUE),
    ('HidroSentinela', 'HIDROSENTINELA', 'INTERNA',
     'Riscos internos, fatores explicativos, alertas informativos e previsoes experimentais.', FALSE, TRUE)
ON CONFLICT (sigla) DO NOTHING;

INSERT INTO hidro.tipo_variavel
    (codigo, nome, categoria, unidade, periodo_referencia_min, descricao)
VALUES
    ('PRECIP_10MIN', 'Precipitacao acumulada em 10 min', 'PRECIPITACAO', 'mm', 10,
     'Precipitacao acumulada em janela de dez minutos, quando disponibilizada pela fonte.'),
    ('PRECIP_1H', 'Precipitacao acumulada em 1 h', 'PRECIPITACAO', 'mm', 60,
     'Precipitacao acumulada em uma hora.'),
    ('PRECIP_6H', 'Precipitacao acumulada em 6 h', 'PRECIPITACAO', 'mm', 360,
     'Variavel derivada ou fornecida pela fonte para contexto de chuva recente.'),
    ('PRECIP_24H', 'Precipitacao acumulada em 24 h', 'PRECIPITACAO', 'mm', 1440,
     'Precipitacao acumulada em vinte e quatro horas.'),
    ('NIVEL_RIO', 'Nivel do rio', 'HIDROLOGIA', 'm', NULL,
     'Cota observada em estacao hidrologica.'),
    ('VAZAO_RIO', 'Vazao do rio', 'HIDROLOGIA', 'm³/s', NULL,
     'Vazao observada quando disponibilizada pela fonte.'),
    ('TEMP_AR', 'Temperatura do ar', 'METEOROLOGIA', '°C', NULL,
     'Temperatura do ar.'),
    ('UMIDADE_AR', 'Umidade relativa do ar', 'METEOROLOGIA', '%', NULL,
     'Umidade relativa do ar.'),
    ('VENTO_VEL', 'Velocidade do vento', 'METEOROLOGIA', 'm/s', NULL,
     'Velocidade do vento.'),
    ('PRESSAO_ATM', 'Pressao atmosferica', 'METEOROLOGIA', 'hPa', NULL,
     'Pressao atmosferica.'),
    ('MARE_NIVEL', 'Nivel da mare', 'OCEANOGRAFIA', 'm', NULL,
     'Variavel futura para areas costeiras quando houver fonte confiavel.')
ON CONFLICT (codigo) DO NOTHING;

COMMIT;
