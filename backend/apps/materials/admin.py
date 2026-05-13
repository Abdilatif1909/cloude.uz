from django.contrib import admin

from apps.materials.models import Lecture, Practical


@admin.register(Lecture)
class LectureAdmin(admin.ModelAdmin):
    list_display = ("title", "uploaded_at", "source_path")
    search_fields = ("title", "source_path")
    list_filter = ("uploaded_at",)


@admin.register(Practical)
class PracticalAdmin(admin.ModelAdmin):
    list_display = ("title", "uploaded_at", "source_path")
    search_fields = ("title", "source_path")
    list_filter = ("uploaded_at",)