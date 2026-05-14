from django.db import models

from utils.validators import validate_pdf_file
from utils.pdf_delivery import build_github_raw_url, get_pdf_file_name


class BaseMaterial(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to="materials/", validators=[validate_pdf_file], blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    source_path = models.CharField(max_length=500, blank=True)
    file_hash = models.CharField(max_length=64, blank=True, db_index=True)

    class Meta:
        abstract = True
        ordering = ["title"]

    def __str__(self):
        return self.title

    @property
    def pdf_url(self):
        return build_github_raw_url(self.source_path)

    @property
    def download_url(self):
        return self.pdf_url

    @property
    def file_name(self):
        return get_pdf_file_name(self.source_path)


class Lecture(BaseMaterial):
    file = models.FileField(upload_to="lectures/", validators=[validate_pdf_file], blank=True, null=True)


class Practical(BaseMaterial):
    file = models.FileField(upload_to="practicals/", validators=[validate_pdf_file], blank=True, null=True)