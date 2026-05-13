from django.db import models

from utils.validators import validate_image_file, validate_pdf_file


class Book(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to="books/", validators=[validate_pdf_file])
    image = models.ImageField(upload_to="books/images/", validators=[validate_image_file], blank=True, null=True)
    author = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    source_path = models.CharField(max_length=500, blank=True)
    file_hash = models.CharField(max_length=64, blank=True, db_index=True)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title
