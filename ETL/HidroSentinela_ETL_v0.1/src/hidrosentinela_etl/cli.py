from __future__ import annotations
import argparse
from .jobs.sgb_sace_stations import run as run_sgb_sace


def main() -> None:
    parser = argparse.ArgumentParser(description="ETL HidroSentinela")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("sgb-sace-stations", help="Coleta e carrega o catálogo público de estações SGB/SACE")
    args = parser.parse_args()

    if args.command == "sgb-sace-stations":
        run_sgb_sace()


if __name__ == "__main__":
    main()
