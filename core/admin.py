# core/admin.py

from django.contrib import admin
from .models import UserProfile, Resource, Service

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone')

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'semester', 'type', 'uploaded_by', 'created_at')
    list_filter = ('semester', 'type', 'course')

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'provider', 'provider_display_name', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('title', 'description', 'provider_display_name')
