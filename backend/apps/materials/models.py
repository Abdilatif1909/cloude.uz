from django.db import models

from utils.validators import validate_pdf_file


class BaseMaterial(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to="materials/", validators=[validate_pdf_file])
    uploaded_at = models.DateTimeField(auto_now_add=True)
    source_path = models.CharField(max_length=500, blank=True)
    file_hash = models.CharField(max_length=64, blank=True, db_index=True)

    class Meta:
        abstract = True
        ordering = ["title"]

    def __str__(self):
        return self.title


class Lecture(BaseMaterial):
    file = models.FileField(upload_to="lectures/", validators=[validate_pdf_file])


class Practical(BaseMaterial):
    file = models.FileField(upload_to="practicals/", validators=[validate_pdf_file])