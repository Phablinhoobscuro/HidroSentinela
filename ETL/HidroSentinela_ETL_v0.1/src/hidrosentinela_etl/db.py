from contextlib import contextmanager
import psycopg
from .config import Settings


@contextmanager
def connection(settings: Settings):
    with psycopg.connect(settings.dsn) as conn:
        yield conn
