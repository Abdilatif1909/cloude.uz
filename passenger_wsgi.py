import os
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent
BACKEND_DIR = PROJECT_ROOT / "backend"
VENV_SITE_PACKAGES = Path("/home/cloudeu2/virtualenv/lms/3.12/lib/python3.12/site-packages")

for path in (PROJECT_ROOT, BACKEND_DIR, VENV_SITE_PACKAGES):
    path_str = str(path)
    if path.exists() and path_str not in sys.path:
        sys.path.insert(0, path_str)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
os.environ.setdefault("PYTHON_EGG_CACHE", str(PROJECT_ROOT / ".python-eggs"))

from config.wsgi import application  # noqa: E402
