from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from apps.users.models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ("username", "email", "full_name", "role", "is_staff", "is_active", "date_joined")
    list_filter = ("role", "is_staff", "is_active", "date_joined")
    search_fields = ("username", "email", "full_name")
    ordering = ("username",)
    fieldsets = UserAdmin.fieldsets + (("Platform", {"fields": ("full_name", "role")}),)
    add_fieldsets = UserAdmin.add_fieldsets + (("Platform", {"fields": ("email", "full_name", "role")}),)
