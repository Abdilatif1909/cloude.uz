# Apache Static Fix Report

## Root Cause

Production requests for:

```text
/static/frontend/assets/index-CkPxsyms.js
```

were returning:

```text
Content-Type: text/html
```

with the body of `frontend/index.html`.

That means the request was not being served as a static file by Apache or WhiteNoise before the React SPA fallback response was generated.

Project-side Django routing was already hardened so `/static/*` does not match the SPA catch-all. Local Django verification returns:

```text
200
application/javascript
```

for the same asset. Therefore the remaining production failure is an Apache/cPanel routing layer issue: `/static/*` must be excluded from Passenger/SPA handling and mapped to collected static files.

## Final Resolution

Added root `.htaccess` for Ahost cPanel Passenger.

It:

- Enables Passenger for `/home/cloudeu2/lms`.
- Uses the cPanel virtualenv Python binary.
- Adds explicit MIME types for JavaScript, CSS, and SVG files.
- Rewrites `/static/*` to `backend/staticfiles/*` before Passenger/Django.
- Rewrites `/media/*` to `backend/media/*` before Passenger/Django.
- Leaves all other requests for Passenger/Django.

Critical rewrite:

```apache
RewriteRule ^static/(.*)$ backend/staticfiles/$1 [L]
```

This ensures:

```text
/static/frontend/assets/index-CkPxsyms.js
```

is served from:

```text
/home/cloudeu2/lms/backend/staticfiles/frontend/assets/index-CkPxsyms.js
```

instead of being routed to the React SPA template.

## Files Changed

- `.htaccess`
- `APACHE_STATIC_FIX_REPORT.md`

## Existing Django Static Configuration

Confirmed:

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

Confirmed middleware order:

```python
"django.middleware.security.SecurityMiddleware",
"whitenoise.middleware.WhiteNoiseMiddleware",
```

WhiteNoise is in the correct position immediately after `SecurityMiddleware`.

## Verification Commands

Run on Ahost from `/home/cloudeu2/lms/backend`:

```bash
source /home/cloudeu2/virtualenv/lms/3.12/bin/activate
python manage.py collectstatic --noinput
python manage.py check
```

Then restart the cPanel Python application.

Validate:

```bash
curl -I https://cloude.uz/static/frontend/assets/index-CkPxsyms.js
```

Expected:

```text
HTTP/2 200
content-type: application/javascript
```

Not expected:

```text
content-type: text/html
```

## Required Ahost cPanel Notes

If cPanel places the domain document root outside `/home/cloudeu2/lms`, copy the committed `.htaccess` contents into the actual document root for `cloude.uz`, or set the domain document root to `/home/cloudeu2/lms`.

The rewrite rule is relative to the document root and expects this layout:

```text
/home/cloudeu2/lms/.htaccess
/home/cloudeu2/lms/backend/staticfiles/frontend/assets/index-CkPxsyms.js
```

If the document root is different, Apache will not see this `.htaccess`, and the old HTML response can continue.

## Commit

Commit hash: `PENDING`
