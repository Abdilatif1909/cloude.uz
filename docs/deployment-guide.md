# Deployment Guide

## Requirements
- Docker and Docker Compose
- Domain with HTTPS terminated at a load balancer or reverse proxy
- Strong `.env` values based on `.env.example`

## Production Start
```bash
cp .env.example .env
# edit secrets, hosts, HTTPS origins, database password
docker compose up -d --build
```

## Health Checks
- `/live/` process liveness
- `/ready/` database readiness
- `/health/` basic application health
- `/version/` deployed application version

## Backups
```bash
BACKUP_DIR=/backups/db ./scripts/backup_db.sh
./scripts/restore_db.sh /backups/db/lms-YYYYMMDD-HHMMSS.dump
BACKUP_DIR=/backups/media MEDIA_ROOT=./backend/media ./scripts/backup_media.sh
./scripts/restore_media.sh /backups/media/media-YYYYMMDD-HHMMSS.tar.gz
```

## Verification
```bash
python manage.py check --deploy
python manage.py makemigrations --check --dry-run --noinput
python manage.py test --noinput
python manage.py collectstatic --noinput
npm run build
docker compose build
```
