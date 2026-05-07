#!/usr/bin/env bash
# Exit on error
set -o errexit

pip install -r requirements.
python manage.py collectstatic --noinput
python manage.py migrate