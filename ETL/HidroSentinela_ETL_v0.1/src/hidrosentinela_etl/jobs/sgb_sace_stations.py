from __future__ import annotations
from ..config import Settings
from ..db import connection
from ..extractors.sgb_sace import extract_sace_stations
from ..loaders.points import load_sace_points
from ..repositories import (
    finish_integration_log,
    get_source_id,
    mark_raw_processed,
    save_raw_payload,
    start_integration_log,
)

JOB_NAME = "sgb_sace_catalogo_estacoes"
SOURCE_SIGLA = "SGB/SACE"


def run() -> None:
    settings = Settings()

    with connection(settings) as conn:
        source_id = get_source_id(conn, SOURCE_SIGLA)
        log_id = start_integration_log(conn, source_id, JOB_NAME)
        conn.commit()

        try:
            payload = extract_sace_stations(settings)
            received = len(payload.get("features", []))
            raw_id, is_new = save_raw_payload(
                conn,
                source_id=source_id,
                payload=payload,
                resource_origin=settings.sgb_sace_url,
                external_id="SACE_FEATURE_LAYER_3",
            )

            processed, skipped = load_sace_points(conn, source_id, payload)
            mark_raw_processed(conn, raw_id, "PROCESSADO")
            finish_integration_log(
                conn,
                log_id,
                status="SUCESSO" if skipped == 0 else "PARCIAL",
                received=received,
                processed=processed,
                errors=skipped,
                details={"payload_novo": is_new, "bbox": settings.sgb_sace_bbox},
            )
            conn.commit()
            print(f"SGB/SACE concluído: recebidos={received}, processados={processed}, ignorados={skipped}")

        except Exception as exc:
            conn.rollback()
            # O log inicial foi commitado antes da extração; reabre atualização após rollback.
            finish_integration_log(
                conn,
                log_id,
                status="ERRO",
                received=0,
                processed=0,
                errors=1,
                message=str(exc)[:4000],
            )
            conn.commit()
            raise
