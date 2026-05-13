from django.contrib.auth.models import AbstractUser
from django.db import models

from utils.constants import ROLE_CHOICES, ROLE_STUDENT


class User(AbstractUser):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_STUDENT)

    REQUIRED_FIELDS = ["email", "full_name"]

    class Meta:
        ordering = ["username"]

    @property
    def display_name(self):
        return self.full_name or self.username

    def save(self, *args, **kwargs):
        self.email = self.email.lower().strip()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.display_name} ({self.role})"
