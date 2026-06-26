# Static Routing Fix Report

## Root Cause

The Django URL configuration had a broad SPA fallback:

```python
path("<path:path>", TemplateView.as_view(template_name="frontend/index.html"), name="frontend-spa")
```

If WhiteNoise did not find a requested static file in `STATIC_ROOT`, the request continued into Django URL routing and matched the SPA fallback. That caused paths such as:

```text
/static/frontend/assets/index-CkPxsyms.js
```

to return `frontend/index.html` with `Content-Type: text/html` instead of returning JavaScript or a static-file 404.

This is especially risky on cPanel Passenger when:

- `collectstatic` has not been run after a Git pull,
- `STATIC_ROOT` is stale,
- Apache forwards `/static/*` to Passenger,
- or the built frontend exists in `backend/static/frontend` but not in `backend/staticfiles`.

## Fix

Two backend changes were made:

1. Added an explicit `/static/...` route before the SPA fallback.

   The route serves static files from:

   - `STATIC_ROOT`
   - each directory in `STATICFILES_DIRS`

   This makes cPanel Passenger robust even when Apache forwards static requests to Django.

2. Replaced the unrestricted SPA fallback with a regex fallback that excludes backend/static prefixes:

   ```text
   static/
   media/
   api/
   admin/
   health/
   ready/
   live/
   version/
   ```

   Missing static files now return 404 instead of `frontend/index.html`.

3. Added WhiteNoise MIME overrides so JavaScript assets return:

   ```text
   Content-Type: application/javascript
   ```

## Files Changed

- `backend/config/urls.py`
- `backend/config/settings.py`
- `STATIC_ROUTING_FIX_REPORT.md`

## Static Configuration

Current static settings:

```python
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [path for path in (BACKEND_STATIC_DIR, FRONTEND_DIST_DIR) if path.exists()]
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
WHITENOISE_MIMETYPES = {
    ".js": "application/javascript",
    ".mjs": "application/javascript",
}
```

WhiteNoise remains enabled in middleware:

```python
"whitenoise.middleware.WhiteNoiseMiddleware"
```

## Verification Commands

Run from `backend/`:

```bash
python manage.py check
python manage.py collectstatic --noinput
```

Both passed.

Additional Django request verification:

```text
/static/frontend/assets/index-CkPxsyms.js
status: 200
content-type: application/javascript
first-bytes: b'const __vite__mapDeps=(i,m=__vite__mapDe'

/static/frontend/assets/missing-file.js
status: 404
content-type: text/html; charset=utf-8

/
status: 200
content-type: text/html; charset=utf-8
```

The important result is that an existing JavaScript asset returns JavaScript, and a missing static asset no longer falls through to the React SPA HTML.

## Commit

Static routing fix commit hash: `e5b39c2`
