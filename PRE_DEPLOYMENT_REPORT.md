# Pre-Deployment Report

Project: Cloud Education Platform / cloude.uz
Course: Sun'iy intellekt asoslari
University: Axborot Texnologiyalari va Menejment Universiteti
Target domain: cloude.uz
Deployment target: Ahost (deployment not performed)

## Repository Cleanup Summary

The repository has been staged for a clean push of the current LMS project. The previous web-programming/course repository surface was removed from the tracked tree and replaced with the current Django + React LMS.

Ignored/generated files are excluded by `.gitignore`, including:

- `venv/`, `.venv/`
- `node_modules/`, `frontend/node_modules/`
- `__pycache__/`, `**/__pycache__/`
- `.pytest_cache/`, `.mypy_cache/`, `.ruff_cache/`
- `.env`, `.env.*` except committed `.env.example` templates
- `media/`
- `logs/`, `**/logs/`, `*.log`
- `dist/`, `frontend/dist/`
- `build/`, `coverage/`
- temporary OS/editor files

## Files Removed

Major obsolete tracked content removed from the repository:

- Old GitHub Pages deployment files: `.github/workflows/deploy-pages.yml`, `CNAME`, `frontend/public/CNAME`, `frontend/public/404.html`
- Old web-programming backend modules: `backend/apps/assessments`, `backend/apps/books`, `backend/apps/search`, `backend/apps/users`
- Old backend compatibility/project files: `backend/webdasturlashedu`, `backend/services`, `backend/utils`, `backend/build.sh`, `backend/templates/admin/base_site.html`
- Old frontend implementation: legacy components, Tailwind/PostCSS config, old context providers, old test/teacher pages, old dashboard pages, old service modules
- Old generated/runtime env files: `frontend/.env`, `frontend/.env.development`, `frontend/.env.production`
- Old web-programming PDFs and old root PDF artifact: `1719224135.pdf`, old `pdf/amaliy`, `pdf/kitoblar`, and `pdf/maruza/*-bob.pdf`
- Old Render config: `render.yaml`

Current AI course PDFs, quiz data, docs, Docker/nginx files, backup scripts, and LMS source files are kept.

## Branding Changes

Branding has been standardized to:

- Product: `Cloud Education Platform`
- Domain/short brand: `cloude.uz`
- Course: `Sun'iy intellekt asoslari`
- University: `Axborot Texnologiyalari va Menejment Universiteti`

Updated areas:

- Frontend document title and meta description
- Sidebar brand
- Header logo and topbar
- Login page logo and title
- Landing page logo, copy, and product naming
- Footer product/university text
- Django admin header/title/index title
- API schema title/description
- Env examples for `cloude.uz`

## Header Logo Integration

Added retina-sharp SVG brand assets:

- `frontend/public/brand-logo.svg`
- `frontend/public/favicon.svg`

Integrated into:

- Main header/topbar
- Sidebar
- Login page
- Landing page
- Browser favicon
- Apple touch icon reference

Note: no uploaded binary logo file was present in the workspace or Codex attachment directory during this run. A clean SVG brand asset was added so the app is deployment-ready. If the official university logo file is provided later, replace `frontend/public/brand-logo.svg` and regenerate `frontend/public/favicon.svg`; the React code already points to those stable asset paths.

## Deployment Readiness

Backend production readiness:

- `STATIC_ROOT` configured as `backend/staticfiles`
- `MEDIA_ROOT` configured as `backend/media`
- Whitenoise enabled with `CompressedManifestStaticFilesStorage`
- `ALLOWED_HOSTS` defaults include `cloude.uz` and `www.cloude.uz`
- `CSRF_TRUSTED_ORIGINS` defaults include `https://cloude.uz` and `https://www.cloude.uz`
- `CORS_ALLOWED_ORIGINS` defaults include `https://cloude.uz` and `https://www.cloude.uz`
- `gunicorn` and `whitenoise` are present in `backend/requirements.txt`
- Root `Procfile` added for Gunicorn startup
- Production env templates updated
- Database supports `DATABASE_URL`, PostgreSQL env vars, and local SQLite override
- Backend log directory is created at settings load time

Frontend production readiness:

- `npm run build` passes
- Route-level code splitting added with `React.lazy` and `Suspense`
- Favicon and brand assets are included under `frontend/public`
- Generated `frontend/dist` is ignored and not staged

## GitHub Readiness

Repository remote:

- `origin https://github.com/Abdilatif1909/cloude.uz.git`

Prepared for push:

- Obsolete tracked files staged for removal
- Current LMS files staged for addition/update
- Generated runtime files ignored
- `.env` files are not staged
- Env templates contain placeholders only, not real secrets
- No debug statements or stale temporary UI branding found in the source scan

## Verification Results

Commands run successfully:

```bash
python manage.py check
python manage.py makemigrations --check
python manage.py collectstatic --noinput
npm run build
```

Results:

- `python manage.py check`: passed, no issues
- `python manage.py makemigrations --check`: passed, no changes detected
- `python manage.py collectstatic --noinput`: passed, 163 static files already present
- `npm run build`: passed, production build generated successfully

Backend verification was run with production-style env values and local SQLite override for this workstation check.

## Known Issues

- Deployment to Ahost was intentionally not performed.
- The actual uploaded university logo file was not available in the workspace/attachments. The project is wired to stable SVG logo paths and can accept the official logo by replacing `frontend/public/brand-logo.svg`.
