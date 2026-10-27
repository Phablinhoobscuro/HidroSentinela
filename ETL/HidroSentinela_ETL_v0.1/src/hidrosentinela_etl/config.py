from dataclasses import dataclass
import os
from dotenv import load_dotenv

load_dotenv()


def _required(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Variável de ambiente obrigatória não definida: {name}")
    return value


@dataclass(frozen=True)
class Settings:
    db_host: str = os.getenv("DB_HOST", "localhost")
    db_port: int = int(os.getenv("DB_PORT", "5432"))
    db_name: str = os.getenv("DB_NAME", "hidrosentinela")
    db_user: str = os.getenv("DB_USER", "postgres")
    db_password: str = os.getenv("DB_PASSWORD", "")
    sgb_sace_url: str = os.getenv(
        "SGB_SACE_URL",
        "https://geoportal.sgb.gov.br/server/rest/services/Hosted/Redes/FeatureServer/3/query",
    )
    sgb_sace_bbox: str = os.getenv("SGB_SACE_BBOX", "-41.90,-21.40,-39.60,-17.80")
    http_timeout_seconds: int = int(os.getenv("HTTP_TIMEOUT_SECONDS", "30"))

    @property
    def dsn(self) -> str:
        if not self.db_password:
            raise RuntimeError("DB_PASSWORD não definido. Copie .env.example para .env e informe a senha.")
        return (
            f"host={self.db_host} port={self.db_port} dbname={self.db_name} "
            f"user={self.db_user} password={self.db_password}"
        )
