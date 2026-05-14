from __future__ import annotations

import hashlib
from dataclasses import dataclass
from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.db import transaction

from apps.books.models import Book
from apps.materials.models import Lecture, Practical


@dataclass
class ImportSummary:
    created: int = 0
    skipped: int = 0


def _hash_file(file_path: Path) -> str:
    digest = hashlib.sha256()
    with file_path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(8192), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _sync_pdf_directory(directory: Path, model_class, upload_prefix: str) -> ImportSummary:
    summary = ImportSummary()
    directory.mkdir(parents=True, exist_ok=True)

    for pdf_path in sorted(directory.glob("*.pdf")):
        file_hash = _hash_file(pdf_path)
        source_path = str(pdf_path.resolve())
        if model_class.objects.filter(file_hash=file_hash).exists() or model_class.objects.filter(source_path=source_path).exists():
            summary.skipped += 1
            continue

        with transaction.atomic():
            instance_kwargs = {
                "title": pdf_path.stem,
                "source_path": source_path,
                "file_hash": file_hash,
            }
            if hasattr(model_class, "author"):
                instance_kwargs["author"] = "Local PDF Library"

            instance = model_class(**instance_kwargs)
            with pdf_path.open("rb") as stream:
                instance.file.save(pdf_path.name, File(stream), save=False)
            instance.save()
            summary.created += 1

    return summary


def import_pdfs() -> dict[str, ImportSummary]:
    lecture_summary = _sync_pdf_directory(settings.PDF_IMPORT_DIRECTORIES["lectures"], Lecture, "lectures")
    practical_summary = _sync_pdf_directory(settings.PDF_IMPORT_DIRECTORIES["practicals"], Practical, "practicals")
    book_summary = _sync_pdf_directory(settings.PDF_IMPORT_DIRECTORIES["books"], Book, "books")
    return {"lectures": lecture_summary, "practicals": practical_summary, "books": book_summary}


def ensure_pdf_library_seeded() -> None:
    if Lecture.objects.exists() and Practical.objects.exists() and Book.objects.exists():
        return

    import_pdfs()
