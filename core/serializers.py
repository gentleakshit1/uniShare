from rest_framework import serializers
from .models import Resource, Service, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'phone']

class ResourceSerializer(serializers.ModelSerializer):
    # This automatically fetches the uploader's username so we can display it on the frontend!
    uploaded_by_name = serializers.SerializerMethodField()
    preview_url = serializers.ReadOnlyField()
    file = serializers.SerializerMethodField()

    class Meta:
        model = Resource
        # We define exactly which fields the React app will be able to see and download
        fields = [
            'id', 'title', 'file', 'preview_url', 'course', 'semester', 'subject', 'type', 
            'uploaded_by', 'uploaded_by_name', 'uploader_display_name', 'created_at',
            'downloads_count', 'upvotes', 'downvotes', 'is_for_sale', 'price', 'is_anonymous'
        ]
        read_only_fields = ['uploaded_by', 'created_at', 'downloads_count', 'upvotes', 'downvotes']

    def get_file(self, obj):
        if not obj.file:
            return None
        url = obj.file.url
        # If Cloudinary dropped the extension, we restore it using the original filename
        if '.' in obj.file.name:
            ext = obj.file.name.split('.')[-1].lower()
            if not url.endswith(f'.{ext}'):
                # Append the extension to the Cloudinary URL so browsers know it's a PDF
                url = f"{url}.{ext}"
        # Ensure it always uses HTTPS
        return url.replace('http://', 'https://')

    def get_uploaded_by_name(self, obj):
        if obj.is_anonymous:
            request = self.context.get('request')
            if request and request.user and request.user.is_staff:
                return f"{obj.uploader_display_name or obj.uploaded_by.username} (Hidden)"
            return 'Anonymous'
        return obj.uploader_display_name or obj.uploaded_by.username

class ServiceSerializer(serializers.ModelSerializer):
    provider_name = serializers.CharField(source='provider.username', read_only=True)

    class Meta:
        model = Service
        fields = ['id', 'title', 'description', 'price', 'provider', 'provider_name', 'provider_display_name', 'provider_image_url', 'contact_info', 'created_at']
        read_only_fields = ['provider', 'created_at']
