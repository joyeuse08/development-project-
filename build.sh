#!/usr/bin/env bash
# Exit on error
set -o errexit

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

pip install -r requirements.txt
python backend/manage.py collectstatic --noinput
python backend/manage.py migrate