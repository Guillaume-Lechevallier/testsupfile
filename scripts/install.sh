#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

info() {
  printf "\n==> %s\n" "$1"
}

copy_env() {
  local source_file="$1"
  local target_file="$2"

  if [[ -f "$target_file" ]]; then
    return
  fi

  if [[ -f "$source_file" ]]; then
    cp "$source_file" "$target_file"
    info "Copie de $(basename "$source_file") vers $(basename "$target_file")"
  fi
}

info "Installation des dépendances back-end"
cd "$ROOT_DIR/back"
copy_env "$ROOT_DIR/back/.env.example" "$ROOT_DIR/back/.env"
npm install

info "Installation des dépendances web"
cd "$ROOT_DIR/web"
copy_env "$ROOT_DIR/web/.env.example" "$ROOT_DIR/web/.env"
npm install

info "Installation des dépendances mobile"
cd "$ROOT_DIR/mobile"
copy_env "$ROOT_DIR/mobile/.env.example" "$ROOT_DIR/mobile/.env"
npm install

info "Initialisation de la base de données"
cd "$ROOT_DIR"
if [[ -f "$ROOT_DIR/back/.env" ]]; then
  set -a
  source "$ROOT_DIR/back/.env"
  set +a
fi

DB_NAME="${DB_NAME:-supfile}"
DB_USER="${DB_USER:-supfile}"
DB_HOST="${DB_HOST:-localhost}"
DB_PASSWORD="${DB_PASSWORD:-}"

if command -v psql >/dev/null 2>&1; then
  export PGPASSWORD="$DB_PASSWORD"
  psql -h "$DB_HOST" -U "$DB_USER" -d postgres -v ON_ERROR_STOP=1 <<SQL
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}') THEN
    CREATE DATABASE "${DB_NAME}";
  END IF;
END
$$;
SQL

  psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 -f "$ROOT_DIR/back/db/init.sql"
  info "Base de données initialisée."
else
  info "psql non trouvé. Installez PostgreSQL puis relancez la section DB."
fi

info "Installation terminée."
