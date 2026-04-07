from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Roles(models.TextChoices):
        ADMIN = "admin", "Admin"
        MANAGER = "manager", "Manager"
        STAFF = "staff", "Staff"

    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.STAFF)

    def __str__(self):
        return f"{self.username} ({self.role})"
