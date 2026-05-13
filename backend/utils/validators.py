from pathlib import Path

from django.core.exceptions import ValidationError


ALLOWED_PDF_SUFFIXES = {".pdf"}
ALLOWED_IMAGE_SUFFIXES = {".png", ".jpg", ".jpeg", ".webp"}


def validate_pdf_file(file_obj):
    suffix = Path(file_obj.name).suffix.lower()
    if suffix not in ALLOWED_PDF_SUFFIXES:
        raise ValidationError("Only PDF files are allowed.")


def validate_image_file(file_obj):
    if not file_obj:
        return
    suffix = Path(file_obj.name).suffix.lower()
    if suffix not in ALLOWED_IMAGE_SUFFIXES:
        raise ValidationError("Only image files are allowed.")
