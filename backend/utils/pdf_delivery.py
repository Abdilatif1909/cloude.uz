from __future__ import annotations

from pathlib import Path
from urllib.parse import quote

from django.conf import settings


def get_pdf_repo_relative_path(source_path: str | None) -> str | None:
    if not source_path:
        return None

    normalized = str(source_path).replace("\\", "/")
    marker = "/pdf/"
    if marker in normalized:
        suffix = normalized.split(marker, 1)[1].lstrip("/")
        return f"pdf/{suffix}" if suffix else None

    project_root = Path(getattr(settings, "PROJECT_ROOT", Path.cwd())).resolve()
    try:
        relative_path = Path(source_path).resolve().relative_to(project_root)
    except (ValueError, OSError, RuntimeError):
        return None

    return relative_path.as_posix()


def build_github_raw_url(source_path: str | None) -> str | None:
    relative_path = get_pdf_repo_relative_path(source_path)
    if not relative_path:
        return None

    base_url = getattr(settings, "GITHUB_RAW_BASE_URL", "").rstrip("/")
    if not base_url:
        return None

    return f"{base_url}/{quote(relative_path, safe='/')}"


def get_pdf_file_name(source_path: str | None) -> str | None:
    relative_path = get_pdf_repo_relative_path(source_path)
    if not relative_path:
        return None

    return Path(relative_path).name