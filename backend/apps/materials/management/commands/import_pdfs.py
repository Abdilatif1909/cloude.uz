from django.core.management.base import BaseCommand

from services.pdf_import_service import import_pdfs


class Command(BaseCommand):
    help = "Scan PDF directories and import lecture, practical, and book files into the database."

    def handle(self, *args, **options):
        summary = import_pdfs()
        for category, stats in summary.items():
            self.stdout.write(
                self.style.SUCCESS(
                    f"{category}: created={stats.created}, skipped={stats.skipped}"
                )
            )