-- Executar depois que regiao_monitorada possuir geometrias oficiais.
-- Associa automaticamente cada ponto de monitoramento à menor região que o contém.
UPDATE hidro.ponto_monitoramento p
SET id_regiao = candidato.id_regiao
FROM LATERAL (
    SELECT r.id_regiao
    FROM hidro.regiao_monitorada r
    WHERE r.ativo = TRUE
      AND ST_Contains(r.geom, p.geom)
    ORDER BY ST_Area(r.geom::geography) ASC
    LIMIT 1
) AS candidato
WHERE p.id_regiao IS DISTINCT FROM candidato.id_regiao;
