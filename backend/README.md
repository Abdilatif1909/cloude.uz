# WebDasturlashEdu Backend

Backend Django + DRF asosida yozilgan va quyidagi kataloglarga bo‘lingan:

- `apps/`
- `config/`
- `api/`
- `services/`
- `utils/`

## Tez start

1. `pip install -r requirements.txt`
2. `python manage.py makemigrations`
3. `python manage.py migrate`
4. `python manage.py import_pdfs`
5. `python manage.py createsuperuser`
6. `python manage.py runserver`

## PDF import

- Ma’ruzalar: `D:/Farrux aka/Baron/pdf/maruza/`
- Amaliyot: `D:/Farrux aka/Baron/pdf/amaliy/`

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