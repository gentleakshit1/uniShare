from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Resource(models.Model):
    CATEGORY_CHOICES = [
        ('notes', 'Notes'),
        ('paper', 'Previous Year Paper'),
        ('assignment', 'Assignment'),
        ('other', 'Other'),
    ]

    SEMESTER_CHOICES = [(str(i), f"Semester {i}") for i in range(1, 9)]

    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='resources/')
    course = models.CharField(max_length=100)
    semester = models.CharField(max_length=10, choices=SEMESTER_CHOICES)
    subject = models.CharField(max_length=100)
    type = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15)

    def __str__(self):
        return f"{self.user.username}'s profile"