-- 03_triggers.sql

BEGIN;

CREATE OR REPLACE FUNCTION hidro.fn_touch_atualizado_em()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.atualizado_em := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_municipio_touch_atualizado_em
BEFORE UPDATE ON hidro.municipio
FOR EACH ROW
EXECUTE FUNCTION hidro.fn_touch_atualizado_em();

CREATE TRIGGER trg_regiao_touch_atualizado_em
BEFORE UPDATE ON hidro.regiao_monitorada
FOR EACH ROW
EXECUTE FUNCTION hidro.fn_touch_atualizado_em();

COMMIT;
