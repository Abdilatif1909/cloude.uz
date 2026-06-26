# Passenger Fix Report

## Root Cause

cPanel Passenger must load the Django WSGI application from the Django project entrypoint, not from `passenger_wsgi.py` itself.

The dangerous pattern is:

```python
wsgi = load_source("wsgi", "passenger_wsgi.py")
application = wsgi.application
```

That recursively imports `passenger_wsgi.py` and can prevent the Python application from starting.

## Correct Import Path

The fixed root `passenger_wsgi.py` now loads:

```text
backend/config/wsgi.py
```

It uses `importlib.util.spec_from_file_location()` with a non-conflicting module name:

```python
spec = importlib.util.spec_from_file_location("cloudeuz_django_wsgi", DJANGO_WSGI)
```

Then it exposes:

```python
application = django_wsgi.application
```

## cPanel Passenger Compatibility

The file:

- Adds `/home/cloudeu2/lms/backend` and `/home/cloudeu2/lms` to `sys.path`.
- Adds the cPanel virtualenv site-packages path when it exists.
- Sets `DJANGO_SETTINGS_MODULE=config.settings`.
- Sets `PYTHON_EGG_CACHE` under the project root.
- Exposes a standard WSGI `application` callable for Passenger.

## Files Changed

- `passenger_wsgi.py`
- `PASSENGER_FIX_REPORT.md`

## Verification

Commands run:

```bash
python -c "import passenger_wsgi; print(passenger_wsgi.application.__class__.__name__)"
python manage.py check
```

Results:

- Passenger import: passed, returned `WSGIHandler`
- Django system check: passed, no issues

## Commit

Commit hash: `c235480`
