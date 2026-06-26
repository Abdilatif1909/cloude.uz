# Installation Guide

## Local Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py makemigrations
python manage.py migrate
python manage.py loaddata fixtures/initial_course.json
python manage.py createsuperuser
python manage.py runserver
```

## Local Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Docker

```bash
cp .env.example .env
docker compose up --build
docker compose exec backend python manage.py loaddata fixtures/initial_course.json
docker compose exec backend python manage.py createsuperuser
```

Frontend: `http://localhost:5173`

Backend API: `http://localhost:8000/api/v1/`

Swagger: `http://localhost:8000/api/docs/`

## Quiz JSON Import

Teachers can import a quiz from the API or Swagger with `POST /api/v1/quizzes/import-json/` using multipart form field `file`.

```json
{
  "lesson": 1,
  "title": "AI Basics",
  "questions": [
    {
      "question": "What is AI?",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "Explanation text"
    }
  ]
}
```
