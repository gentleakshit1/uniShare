import logging
from rest_framework import viewsets, filters, parsers

logger = logging.getLogger(__name__)
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from .models import Resource, Service
from .serializers import ResourceSerializer, ServiceSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import Vote

@api_view(['POST'])
@permission_classes([IsAuthenticatedOrReadOnly])
def sync_user(request):
    try:
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
            
        data = request.data
        if 'first_name' in data:
            user.first_name = data['first_name'][:150]
        if 'last_name' in data:
            user.last_name = data['last_name'][:150]
        if 'email' in data:
            user.email = data['email'][:254]
            
        # Update last login time
        user.last_login = timezone.now()
        user.save()
        
        return Response({'status': 'success'})
    except Exception as e:
        logger.error(f"Error syncing user: {str(e)}", exc_info=True)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all().order_by('-created_at')
    serializer_class = ResourceSerializer
    # Only authenticated users can create/update/delete. Anyone can read.
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    # Add advanced filtering capabilities
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['course', 'semester', 'subject', 'type']
    search_fields = ['title', 'course', 'subject']

    def perform_create(self, serializer):
        try:
            import base64
            uploaded_file = self.request.FILES.get('file')
            file_base64 = None
            if uploaded_file:
                file_bytes = uploaded_file.read()
                file_base64 = base64.b64encode(file_bytes).decode('utf-8')
            
            # We now have real Clerk Auth syncing the user to request.user!
            serializer.save(
                uploaded_by=self.request.user,
                file_base64=file_base64
            )
        except Exception as e:
            logger.error(f"Error creating resource: {str(e)}", exc_info=True)
            raise ValidationError(str(e))

    @action(detail=True, methods=['get'], permission_classes=[])
    def download_file(self, request, pk=None):
        try:
            import base64
            from django.http import HttpResponse
            resource = self.get_object()
            if not resource.file_base64:
                return Response({'error': 'No file found in database'}, status=status.HTTP_404_NOT_FOUND)
            
            file_data = base64.b64decode(resource.file_base64)
            # Default to PDF since that is our primary use case
            response = HttpResponse(file_data, content_type='application/pdf')
            # Inline will try to open in browser, attachment forces download
            response['Content-Disposition'] = f'inline; filename="{resource.title}.pdf"'
            
            # Optionally track download here too
            resource.downloads_count += 1
            resource.save(update_fields=['downloads_count'])
            
            return response
        except Exception as e:
            logger.error(f"Error serving file: {str(e)}", exc_info=True)
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'], permission_classes=[]) # Keep it open if we want to allow guests? No, let's use the class permission.
    def download(self, request, pk=None):
        try:
            resource = self.get_object()
            resource.downloads_count += 1
            resource.save(update_fields=['downloads_count'])
            return Response({'status': 'download tracked', 'downloads_count': resource.downloads_count})
        except Exception as e:
            logger.error(f"Error tracking download: {str(e)}", exc_info=True)
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def my_resources(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
            
            resources = Resource.objects.filter(uploaded_by=user).order_by('-created_at')
            serializer = self.get_serializer(resources, many=True)
            
            # Calculate totals
            from django.db.models import Sum
            totals = resources.aggregate(
                total_downloads=Sum('downloads_count'),
                total_upvotes=Sum('upvotes')
            )
            
            return Response({
                'stats': {
                    'total_uploads': resources.count(),
                    'total_downloads': totals['total_downloads'] or 0,
                    'total_upvotes': totals['total_upvotes'] or 0,
                },
                'resources': serializer.data
            })
        except Exception as e:
            logger.error(f"Error in my_resources: {str(e)}", exc_info=True)
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response({'error': 'You must be logged in to vote.'}, status=status.HTTP_401_UNAUTHORIZED)
            
            vote_type = request.data.get('vote_type')
            if vote_type not in ['UP', 'DOWN']:
                return Response({'error': 'Invalid vote type. Must be UP or DOWN.'}, status=status.HTTP_400_BAD_REQUEST)
            
            resource = self.get_object()
            
            vote, created = Vote.objects.get_or_create(
                user=user, resource=resource, 
                defaults={'vote_type': vote_type}
            )
            
            if not created:
                if vote.vote_type != vote_type:
                    # Switched vote
                    if vote.vote_type == 'UP':
                        resource.upvotes -= 1
                        resource.downvotes += 1
                    else:
                        resource.downvotes -= 1
                        resource.upvotes += 1
                    vote.vote_type = vote_type
                    vote.save()
                    resource.save(update_fields=['upvotes', 'downvotes'])
                else:
                    # Same vote -> toggle off
                    if vote.vote_type == 'UP':
                        resource.upvotes -= 1
                    else:
                        resource.downvotes -= 1
                    vote.delete()
                    resource.save(update_fields=['upvotes', 'downvotes'])
                    return Response({'status': 'vote removed', 'upvotes': resource.upvotes, 'downvotes': resource.downvotes})
            else:
                # New vote
                if vote_type == 'UP':
                    resource.upvotes += 1
                else:
                    resource.downvotes += 1
                resource.save(update_fields=['upvotes', 'downvotes'])
                
            return Response({'status': 'vote recorded', 'upvotes': resource.upvotes, 'downvotes': resource.downvotes})
        except Exception as e:
            logger.error(f"Error recording vote: {str(e)}", exc_info=True)
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all().order_by('-created_at')
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description']

    def perform_create(self, serializer):
        try:
            serializer.save(provider=self.request.user)
        except Exception as e:
            logger.error(f"Error creating service: {str(e)}", exc_info=True)
            raise ValidationError(str(e))
