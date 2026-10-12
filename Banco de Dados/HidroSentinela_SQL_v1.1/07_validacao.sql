-- 07_validacao.sql
-- Consultas de verificacao apos a criacao.

-- 1. Verificar extensao PostGIS
SELECT postgis_full_version();

-- 2. Verificar tabelas criadas no schema hidro
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'hidro'
ORDER BY table_name;

-- 3. Verificar views
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'hidro'
ORDER BY table_name;

-- 4. Verificar fontes cadastradas
SELECT id_fonte, sigla, tipo_fonte, oficial, ativo
FROM hidro.fonte_dados
ORDER BY id_fonte;

-- 5. Verificar catalogo de variaveis
SELECT codigo, nome, categoria, unidade, periodo_referencia_min
FROM hidro.tipo_variavel
ORDER BY categoria, codigo;

-- 6. Contagem esperada de tabelas-base do modelo (21 tabelas)
SELECT COUNT(*) AS quantidade_tabelas
FROM information_schema.tables
WHERE table_schema = 'hidro'
  AND table_type = 'BASE TABLE';

-- 7. Verificar contas administrativas (esperado: inicialmente zero)
SELECT id_administrador, email, ativo, criado_em
FROM hidro.administrador
ORDER BY id_administrador;
