# WebDasturlashEdu

WebDasturlashEdu — React frontend va Django REST Framework backend bilan qurilgan zamonaviy ta’lim platformasi.

## Backend arxitekturasi

Backend professional DRF structure bilan yozilgan:

- [backend/apps](backend/apps) — domain app'lar
- [backend/config](backend/config) — settings, urls, asgi, wsgi
- [backend/api](backend/api) — API route composition
- [backend/services](backend/services) — business logic va import services
- [backend/utils](backend/utils) — permissions, pagination, validators, constants

## Backend stack

- Django
- Django REST Framework
- SimpleJWT
- SQLite
- CORS Headers
- Pillow

## User rollar

- `student`
- `teacher`
- `admin`

## Asosiy modellar

- `User` — `username`, `email`, `role`, `full_name`
- `Lecture` — `title`, `file`, `uploaded_at`
- `Practical` — `title`, `file`, `uploaded_at`
- `Book` — `title`, `file`, `image`, `author`
- `Test` — `title`, `created_by`
- `Question` — `test`, `question`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`
- `Result` — `student`, `test`, `score`, `created_at`

## API endpointlar

### Auth
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `GET|PUT|PATCH /api/auth/profile/`
- `GET|POST|PUT|PATCH|DELETE /api/auth/users/` — admin only

### Content
- `GET|POST /api/lectures/`
- `GET|PUT|PATCH|DELETE /api/lectures/{id}/`
- `GET /api/lectures/{id}/download/`
- `GET|POST /api/practicals/`
- `GET|PUT|PATCH|DELETE /api/practicals/{id}/`
- `GET /api/practicals/{id}/download/`
- `GET|POST /api/books/`
- `GET|PUT|PATCH|DELETE /api/books/{id}/`

### Test system
- `GET|POST /api/tests/`
- `GET|PUT|PATCH|DELETE /api/tests/{id}/`
- `GET /api/tests/{id}/start/`
- `POST /api/tests/{id}/submit/`
- `GET /api/tests/teacher_results/`
- `GET|POST|PUT|PATCH|DELETE /api/questions/`
- `GET /api/results/`

### Search
- `GET /api/search/?q=...`

## Permission qoidalari

- Student: materiallarni o‘qiydi, testni boshlaydi, test topshiradi, o‘z natijalarini ko‘radi.
- Teacher: lecture/practical/test/question boshqaradi, o‘z testlari bo‘yicha student natijalarini ko‘radi.
- Admin: barcha modellarni va user'larni boshqaradi.

## PDF auto import

Import manbalari:

- [pdf/maruza](pdf/maruza)
- [pdf/amaliy](pdf/amaliy)

Management command:

- `python manage.py import_pdfs`

Command quyidagilarni bajaradi:

- PDF fayllarni scan qiladi
- `Lecture` va `Practical` bazasiga yozadi
- `source_path` va `file_hash` orqali duplicate tekshiradi

## Admin panel

- Custom branding
- Gradient admin header
- Search, filter va ordering
- Test va result statistik ko‘rsatkichlari

## Backend setup

1. Virtual environment yarating.
2. Dependency o‘rnating:
   - `pip install -r backend/requirements.txt`
3. Migration yarating va ishga tushiring:
   - `python backend/manage.py makemigrations`
   - `python backend/manage.py migrate`
4. PDF import qiling:
   - `python backend/manage.py import_pdfs`
5. Superuser yarating:
   - `python backend/manage.py createsuperuser`
6. Serverni ishga tushiring:
   - `python backend/manage.py runserver`

## Media va static

- Media root: [backend/media](backend/media)
- Static root: [backend/staticfiles](backend/staticfiles)
- Static source: [backend/static](backend/static)

## Frontend

Frontend qismi [frontend](frontend) ichida joylashgan.
