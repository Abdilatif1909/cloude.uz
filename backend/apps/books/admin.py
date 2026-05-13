from django.contrib import admin

from apps.books.models import Book


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "uploaded_at", "source_path")
    search_fields = ("title", "author", "source_path")
    list_filter = ("uploaded_at", "author")
