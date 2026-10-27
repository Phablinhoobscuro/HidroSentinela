from __future__ import annotations
import hashlib
import json
from typing import Any
from psycopg import Connection
from psycopg.types.json import Jsonb


def get_source_id(conn: Connection, sigla: str) -> int:
    with conn.cursor() as cur:
        cur.execute(
            "SELECT id_fonte FROM hidro.fonte_dados WHERE sigla = %s AND ativo = TRUE",
            (sigla,),
        )
        row = cur.fetchone()
    if not row:
        raise RuntimeError(f"Fonte ativa não encontrada em hidro.fonte_dados: {sigla}")
    return int(row[0])


def start_integration_log(conn: Connection, source_id: int, job_name: str) -> int:
    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO hidro.log_integracao (id_fonte, job_nome, status)
            VALUES (%s, %s, 'EXECUTANDO')
            RETURNING id_log
            """,
            (source_id, job_name),
        )
        return int(cur.fetchone()[0])


def finish_integration_log(
    conn: Connection,
    log_id: int,
    status: str,
    received: int,
    processed: int,
    errors: int = 0,
    message: str | None = None,
    details: dict[str, Any] | None = None,
) -> None:
    with conn.cursor() as cur:
        cur.execute(
            """
            UPDATE hidro.log_integracao
               SET fim_em = CURRENT_TIMESTAMP,
                   status = %s,
                   registros_recebidos = %s,
                   registros_processados = %s,
                   registros_erro = %s,
                   mensagem_erro = %s,
                   detalhes = %s
             WHERE id_log = %s
            """,
            (status, received, processed, errors, message, Jsonb(details) if details else None, log_id),
        )


def save_raw_payload(
    conn: Connection,
    source_id: int,
    payload: Any,
    resource_origin: str,
    external_id: str | None = None,
) -> tuple[int, bool]:
    canonical = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    digest = hashlib.sha256(canonical.encode("utf-8")).hexdigest()

    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO hidro.dado_bruto
                (id_fonte, identificador_externo, recurso_origem, payload, hash_payload)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (id_fonte, hash_payload) DO NOTHING
            RETURNING id_dado_bruto
            """,
            (source_id, external_id, resource_origin, Jsonb(payload), digest),
        )
        row = cur.fetchone()
        if row:
            return int(row[0]), True

        cur.execute(
            "SELECT id_dado_bruto FROM hidro.dado_bruto WHERE id_fonte = %s AND hash_payload = %s",
            (source_id, digest),
        )
        return int(cur.fetchone()[0]), False


def mark_raw_processed(conn: Connection, raw_id: int, status: str = "PROCESSADO", error: str | None = None) -> None:
    with conn.cursor() as cur:
        cur.execute(
            """
            UPDATE hidro.dado_bruto
               SET status_processamento = %s,
                   processado_em = CURRENT_TIMESTAMP,
                   erro_processamento = %s
             WHERE id_dado_bruto = %s
            """,
            (status, error, raw_id),
        )
