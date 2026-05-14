# WebDasturlashEdu Backend

WebDasturlashEdu backend qismi Django REST Framework asosida yozilgan va Render.com ga production deploy qilish uchun tayyorlangan.

## Stack

- Django
- Django REST Framework
- SimpleJWT
- Gunicorn
- WhiteNoise
- PostgreSQL
- python-decouple
- dj-database-url

## Asosiy production fayllar

- [requirements.txt](requirements.txt)
- [Procfile](Procfile)
- [build.sh](build.sh)
- [../render.yaml](../render.yaml)
- [config/settings.py](config/settings.py)
- [.env.example](.env.example)

## Lokal ishga tushirish

1. Dependency o‘rnating:
	- `pip install -r requirements.txt`
2. `.env.example` dan nusxa olib `.env` yarating.
3. Migratsiyalarni bajaring:
	- `python manage.py migrate`
4. Superuser yarating:
	- `python manage.py createsuperuser`
5. Serverni ishga tushiring:
	- `python manage.py runserver`

## Production sozlamalar

Backend quyidagilar bilan production-ready holatga keltirilgan:

- `DEBUG=False`
- `ALLOWED_HOSTS` env orqali boshqariladi
- PostgreSQL `DATABASE_URL` orqali ulanadi
- WhiteNoise static file serving
- Gunicorn WSGI server
- `CORS_ALLOWED_ORIGINS=https://cloude.uz`
- `CSRF_TRUSTED_ORIGINS=https://cloude.uz,https://api.cloude.uz`
- secure cookies, HSTS va SSL redirect

## Render deploy guide

### 1. GitHub repo ulash

1. Render hisobiga kiring.
2. **New +** → **Blueprint** yoki **Web Service** tanlang.
3. GitHub repository sifatida shu loyihani ulang.

### 2. Render service yaratish

#### Variant A — `render.yaml` orqali

1. Repository root ichidagi [../render.yaml](../render.yaml) faylidan foydalaning.
2. Render avtomatik ravishda:
	- web service yaratadi
	- PostgreSQL database yaratadi
	- `DATABASE_URL` ni bog‘laydi

#### Variant B — qo‘lda yaratish

1. **New +** → **Web Service** tanlang.
2. Root directory: `backend`
3. Build command:
	- `bash build.sh`
4. Start command:
	- `gunicorn config.wsgi:application --log-file - --workers 3 --timeout 120`

### 3. Environment variables

Render ichida quyidagi env larni kiriting:

- `SECRET_KEY`
- `DEBUG=False`
- `ALLOWED_HOSTS=api.cloude.uz`
- `DATABASE_URL=<Render PostgreSQL connection string>`
- `CORS_ALLOWED_ORIGINS=https://cloude.uz`
- `CSRF_TRUSTED_ORIGINS=https://cloude.uz,https://api.cloude.uz`
- `SECURE_SSL_REDIRECT=True`

### 4. PostgreSQL ulash

1. Render ichida **New +** → **PostgreSQL** yarating.
2. Hosil bo‘lgan connection string ni `DATABASE_URL` ga ulang.
3. `build.sh` deploy vaqtida avtomatik:
	- `collectstatic`
	- `migrate`
	- `check --deploy`

### 5. Domain connect qilish

Frontend domain:

- `https://cloude.uz`

Backend domain:

- `https://api.cloude.uz`

Render service ichida custom domain sifatida `api.cloude.uz` qo‘shing va DNS yozuvlarini ulang.

## API prefix

Backend API prefix:

- `https://api.cloude.uz/api/`

## Muhim endpointlar

- `/api/auth/register/`
- `/api/auth/login/`
- `/api/auth/refresh/`
- `/api/auth/profile/`
- `/api/lectures/`
- `/api/practicals/`
- `/api/books/`
- `/api/tests/`
- `/api/questions/`
- `/api/results/`
- `/api/search/`