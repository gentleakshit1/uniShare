from rest_framework import serializers
from .models import Resource, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'phone']

class ResourceSerializer(serializers.ModelSerializer):
    # This automatically fetches the uploader's username so we can display it on the frontend!
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True)

    class Meta:
        model = Resource
        # We define exactly which fields the React app will be able to see and download
        fields = ['id', 'title', 'file', 'course', 'semester', 'subject', 'type', 'uploaded_by', 'uploaded_by_name', 'created_at']
        read_only_fields = ['uploaded_by', 'created_at']
