from pathlib import Path

from django.conf import settings
from django.urls import reverse
from django.utils import timezone
from django.utils.text import slugify


def _get_directory(kind: str) -> Path:
    directory = settings.PDF_DIRECTORIES[kind]
    directory.mkdir(parents=True, exist_ok=True)
    return directory


def scan_materials(kind: str, request=None, query: str | None = None):
    directory = _get_directory(kind)
    items = []
    search_term = (query or "").strip().lower()

    for file_path in sorted(directory.glob("*.pdf")):
        if search_term and search_term not in file_path.stem.lower():
            continue

        stat = file_path.stat()
        item = {
            "id": slugify(file_path.stem) or file_path.stem,
            "title": file_path.stem.replace("_", " "),
            "file_name": file_path.name,
            "category": kind,
            "extension": file_path.suffix.lower().replace(".", ""),
            "size_kb": round(stat.st_size / 1024, 2),
            "modified_at": timezone.datetime.fromtimestamp(stat.st_mtime, tz=timezone.get_current_timezone()),
        }
        if request is not None:
            item["view_url"] = request.build_absolute_uri(
                reverse(f"{kind}-view", kwargs={"filename": file_path.name})
            )
            item["download_url"] = request.build_absolute_uri(
                reverse(f"{kind}-download", kwargs={"filename": file_path.name})
            )
        items.append(item)

    return items


def resolve_material_path(kind: str, filename: str) -> Path:
    base_dir = _get_directory(kind).resolve()
    target = (base_dir / filename).resolve()

    if base_dir not in target.parents and target != base_dir:
        raise FileNotFoundError("Invalid path")
    if not target.exists() or target.suffix.lower() != ".pdf":
        raise FileNotFoundError("File not found")
    return target
