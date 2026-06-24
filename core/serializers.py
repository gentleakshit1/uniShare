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
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Resource
        # We define exactly which fields the React app will be able to see and download
        fields = [
            'id', 'title', 'file', 'file_url', 'preview_url', 'course', 'semester', 'subject', 'type', 
            'uploaded_by', 'uploaded_by_name', 'uploader_display_name', 'created_at',
            'downloads_count', 'upvotes', 'downvotes', 'is_for_sale', 'price', 'is_anonymous'
        ]
        read_only_fields = ['uploaded_by', 'created_at', 'downloads_count', 'upvotes', 'downvotes']

    def get_file_url(self, obj):
        if obj.file_base64:
            # Point to our new Database Storage endpoint!
            request = self.context.get('request')
            if request:
                # Return absolute URL if request is available
                return request.build_absolute_uri(f'/api/resources/{obj.id}/download_file/')
            return f'/api/resources/{obj.id}/download_file/'
            
        # Fallback to Cloudinary for older uploads
        if not obj.file:
            return None
        url = obj.file.url
        if '.' in obj.file.name:
            ext = obj.file.name.split('.')[-1].lower()
            if not url.endswith(f'.{ext}'):
                url = f"{url}.{ext}"
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
