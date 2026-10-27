from __future__ import annotations
from psycopg import Connection
from psycopg.types.json import Jsonb


def load_sace_points(conn: Connection, source_id: int, payload: dict) -> tuple[int, int]:
    processed = 0
    skipped = 0

    sql = """
        INSERT INTO hidro.ponto_monitoramento
            (id_fonte, codigo_externo, nome, tipo_ponto, geom, metadados, ativo)
        VALUES
            (%s, %s, %s, 'FLUVIOMETRICO', ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s, TRUE)
        ON CONFLICT (id_fonte, codigo_externo)
        DO UPDATE SET
            nome = EXCLUDED.nome,
            geom = EXCLUDED.geom,
            metadados = EXCLUDED.metadados,
            ativo = TRUE
    """

    with conn.cursor() as cur:
        for feature in payload.get("features", []):
            props = feature.get("properties") or {}
            geom = feature.get("geometry") or {}
            coords = geom.get("coordinates") or []

            code = props.get("codigo")
            name = props.get("nome")
            if len(coords) < 2 or code is None or not name:
                skipped += 1
                continue

            lng, lat = float(coords[0]), float(coords[1])
            metadata = {
                "objectid": props.get("objectid"),
                "ur": props.get("ur"),
                "globalid": props.get("globalid"),
                "origem": "SGB Geoportal - camada SACE",
            }
            cur.execute(sql, (source_id, str(code), str(name), lng, lat, Jsonb(metadata)))
            processed += 1

    return processed, skipped
