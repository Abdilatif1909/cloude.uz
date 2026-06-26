# Ahost cPanel Deployment Report

Project: Cloud Education Platform / cloude.uz
Hosting target: Ahost cPanel Passenger Python Application
Application path on hosting: `/home/cloudeu2/lms`
Python version on hosting: `3.12.13`
Virtual environment on hosting: `/home/cloudeu2/virtualenv/lms/3.12/`

## Root Causes Found

- No `passenger_wsgi.py` existed at the repository root, so cPanel Passenger did not have a direct WSGI entrypoint.
- Production settings selected PostgreSQL whenever `DJANGO_DEBUG=False`, even when no PostgreSQL credentials were configured. On shared hosting this can cause failed or slow startup.
- Frontend API fallbacks pointed to `http://localhost:8000/api/v1`, which is invalid after deploying under `cloude.uz`.
- The React build was not available in a Django-served template/static location for a single cPanel Python app deployment.
- Vite production asset paths needed to target Django static URLs.
- The `.env` loader was not BOM-safe; UTF-8 files created by Windows tooling could fail to load `DJANGO_SECRET_KEY`.

## Files Modified

- `backend/config/settings.py`
- `backend/config/urls.py`
- `backend/.env.example`
- `backend/templates/frontend/index.html`
- `backend/static/frontend/**`
- `frontend/vite.config.js`
- `frontend/index.html`
- `frontend/.env.example`
- `frontend/src/services/api.js`
- `frontend/src/pages/LecturePage.jsx`
- `frontend/src/pages/PracticePage.jsx`
- `frontend/src/pages/ResourcesPage.jsx`
- `frontend/src/layouts/MainLayout.jsx`
- `frontend/src/pages/LoginPage.jsx`
- `frontend/src/pages/CourseListPage.jsx`
- `Procfile`
- `passenger_wsgi.py`
- `scripts/build_cpanel_static.ps1`
- `scripts/build_cpanel_static.sh`
- `.env.example`
- `AHOST_DEPLOYMENT_REPORT.md`

Generated but not committed:

- `backend/.env`
- `backend/db.sqlite3`
- `backend/staticfiles/**`
- `frontend/dist/**`

## Database Mode Selected

Selected mode for Ahost: SQLite.

Reason: PostgreSQL credentials were not provided for the cPanel environment. The app now defaults to SQLite unless PostgreSQL is explicitly configured through `DATABASE_URL` or a complete PostgreSQL env set.

SQLite path generated in `backend/.env`:

```text
/home/cloudeu2/lms/backend/db.sqlite3
```

PostgreSQL support remains available by setting:

```text
DATABASE_URL=postgresql://...
```

or all PostgreSQL variables:

```text
DB_ENGINE=django.db.backends.postgresql
POSTGRES_DB=...
POSTGRES_USER=...
POSTGRES_PASSWORD=...
POSTGRES_HOST=...
POSTGRES_PORT=5432
```

`POSTGRES_CONNECT_TIMEOUT=3` is used to avoid long connection hangs.

## Passenger Configuration

Added root `passenger_wsgi.py`.

It:

- Adds `/home/cloudeu2/lms`, `/home/cloudeu2/lms/backend`, and the cPanel virtualenv site-packages path to `sys.path` when present.
- Sets `DJANGO_SETTINGS_MODULE=config.settings`.
- Imports `application` from `backend/config/wsgi.py` through `config.wsgi`.

Local import verification:

```text
python -c "import passenger_wsgi; print(passenger_wsgi.application.__class__.__name__)"
WSGIHandler
```

## Environment Configuration

Generated `backend/.env` for Ahost with:

- Secure random `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG=False`
- `DJANGO_ALLOWED_HOSTS=cloude.uz,www.cloude.uz,localhost,127.0.0.1`
- `DJANGO_CSRF_TRUSTED_ORIGINS=https://cloude.uz,https://www.cloude.uz`
- `DJANGO_CORS_ALLOWED_ORIGINS=https://cloude.uz,https://www.cloude.uz`
- SQLite database path for shared hosting
- Local-memory cache to avoid requiring Redis on cPanel
- Secure cookie defaults

`backend/.env` is intentionally ignored by git and was not committed.

## Static Configuration

Django static/media configuration:

- `STATIC_URL=/static/`
- `STATIC_ROOT=backend/staticfiles`
- `STATICFILES_DIRS` includes existing `backend/static` and `frontend/dist` when present
- `MEDIA_URL=/media/`
- `MEDIA_ROOT=backend/media`
- Whitenoise enabled through middleware
- `CompressedManifestStaticFilesStorage` enabled

React production build for cPanel:

- Vite cPanel base: `/static/frontend/`
- Built frontend copied to:
  - `backend/templates/frontend/index.html`
  - `backend/static/frontend/**`

Django routes:

- `/api/...`, `/admin/...`, health endpoints, and docs remain backend routes.
- `/` and unknown SPA routes render `frontend/index.html`.

## Frontend Build

Standard build:

```text
npm run build
```

Result: passed.

cPanel build:

```text
scripts/build_cpanel_static.ps1
```

Result: passed. Generated frontend assets reference `/static/frontend/...`.

## Verification Results

Commands run:

```text
python manage.py check
python manage.py migrate
python manage.py collectstatic --noinput
npm run build
python -c "import passenger_wsgi; print(passenger_wsgi.application.__class__.__name__)"
```

Results:

- `python manage.py check`: passed
- `python manage.py migrate`: passed, no migrations pending
- `python manage.py collectstatic --noinput`: passed, copied frontend/static files
- `npm run build`: passed
- Passenger import check: passed, returned `WSGIHandler`

Local verification used `SQLITE_NAME=db.sqlite3` override so the workstation did not try to write to the Ahost absolute path.

## Git

Commit hash: `PENDING`

GitHub push confirmation: `PENDING`
