import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.assessments.models import Question, Test
from apps.users.models import User
from utils.constants import ROLE_ADMIN, ROLE_TEACHER


class Command(BaseCommand):
    help = "Import tests and questions from a JSON file into the assessment module."

    def add_arguments(self, parser):
        parser.add_argument(
            "--file",
            default=str(Path(__file__).resolve().parents[4] / "data" / "tests" / "web_programming_test_bank.json"),
            help="Path to the JSON file that contains tests and questions.",
        )
        parser.add_argument(
            "--replace-questions",
            action="store_true",
            help="Replace existing questions for matched tests before importing new ones.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        file_path = Path(options["file"]).resolve()
        if not file_path.exists():
            raise CommandError(f"JSON file not found: {file_path}")

        try:
            payload = json.loads(file_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            raise CommandError(f"Invalid JSON: {exc}") from exc

        if not isinstance(payload, list):
            raise CommandError("JSON root must be a list of tests.")

        owner = User.objects.filter(role__in=[ROLE_TEACHER, ROLE_ADMIN]).order_by("id").first()
        if not owner:
            raise CommandError("No teacher or admin user found. Create one before importing tests.")

        created_tests = 0
        updated_tests = 0
        created_questions = 0

        for test_data in payload:
            title = str(test_data.get("title", "")).strip()
            questions = test_data.get("questions", [])
            if not title or not isinstance(questions, list) or len(questions) == 0:
                raise CommandError("Each test must contain a title and a non-empty questions list.")

            test, created = Test.objects.update_or_create(
                title=title,
                created_by=owner,
                defaults={
                    "description": str(test_data.get("description", "")).strip(),
                    "difficulty": test_data.get("difficulty", "intermediate"),
                    "estimated_time": int(test_data.get("estimated_time", 15) or 15),
                },
            )

            if created:
                created_tests += 1
            else:
                updated_tests += 1

            if options["replace_questions"]:
                Question.objects.filter(test=test).delete()

            existing_question_count = test.questions.count()
            if existing_question_count and not options["replace_questions"]:
                self.stdout.write(self.style.WARNING(f"Skipped questions for existing test: {test.title}"))
                continue

            for item in questions:
                Question.objects.create(
                    test=test,
                    question=str(item["question"]).strip(),
                    option_a=str(item["option_a"]).strip(),
                    option_b=str(item["option_b"]).strip(),
                    option_c=str(item["option_c"]).strip(),
                    option_d=str(item["option_d"]).strip(),
                    correct_answer=str(item["correct_answer"]).strip(),
                )
                created_questions += 1

        self.stdout.write(self.style.SUCCESS(f"Owner: {owner.username} ({owner.role})"))
        self.stdout.write(self.style.SUCCESS(f"Tests created: {created_tests}"))
        self.stdout.write(self.style.SUCCESS(f"Tests updated: {updated_tests}"))
        self.stdout.write(self.style.SUCCESS(f"Questions created: {created_questions}"))
