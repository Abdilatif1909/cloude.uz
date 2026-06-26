# Sun'iy intellekt asoslari LMS

Production-ready LMS foundation for the university course **Sun'iy intellekt asoslari** with a scalable architecture for future courses.

## Stack

- Django 5, Django REST Framework, PostgreSQL, JWT, CORS, drf-spectacular
- React, Vite, React Router, Axios, Bootstrap 5
- Docker, Docker Compose, Gunicorn, Nginx

## CMS Features

- Admin-managed lectures with PDF preview, counters, publishing, and previous/next navigation
- Practical materials with PDF, examples, source files, difficulty, and estimated time
- YouTube lessons with automatic video ID and thumbnail extraction
- Resource library for PDFs, Office files, archives, images, CSV, Python, and notebooks
- Teacher JSON quiz importer with validation and duplicate prevention
- Admin dashboard cards, latest uploads, recent activity, global search, and statistics API

## Structure

```text
backend/
  api/
  apps/
    accounts/ courses/ lessons/ materials/ videos/ quizzes/ progress/ glossary/ common/
  config/
  media/
frontend/
  src/
    components/ pages/ layouts/ services/ hooks/ assets/
docs/
nginx/
```

## Quick Start

```bash
cp .env.example .env
docker compose up --build
```

Create an admin user:

```bash
docker compose exec backend python manage.py createsuperuser
```

Open:

- Frontend: `http://localhost:5173`
- Admin: `http://localhost:8000/admin/`
- Swagger: `http://localhost:8000/api/docs/`

## Documentation

- [Database schema](docs/database-schema.md)
- [API endpoints](docs/api-endpoints.md)
- [Installation guide](docs/installation.md)
