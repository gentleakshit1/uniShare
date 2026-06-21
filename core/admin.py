# core/admin.py

from django.contrib import admin
from .models import UserProfile, Resource

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone')

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'semester', 'type', 'uploaded_by', 'created_at')
    list_filter = ('semester', 'type', 'course')
