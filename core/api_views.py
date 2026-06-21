from rest_framework import viewsets, filters, parsers
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from .models import Resource
from .serializers import ResourceSerializer
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError

class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all().order_by('-created_at')
    serializer_class = ResourceSerializer
    # Temporarily allow any access while we build the UI
    permission_classes = [AllowAny]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    # Add advanced filtering capabilities
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['course', 'semester', 'subject', 'type']
    search_fields = ['title', 'course', 'subject']

    def perform_create(self, serializer):
        try:
            # We will attach the real user later when auth is enabled.
            # For now, we safely fetch the first user to satisfy the DB constraint
            dummy_user = User.objects.first()
            if not dummy_user:
                raise ValidationError("No Superuser exists in the system to attach this upload to. Please run 'python manage.py createsuperuser'.")
            
            serializer.save(uploaded_by=dummy_user)
        except Exception as e:
            # Re-raise as a clean DRF validation error instead of crashing with 500
            raise ValidationError(str(e))
