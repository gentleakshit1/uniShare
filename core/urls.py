from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import ResourceViewSet, ServiceViewSet, sync_user

router = DefaultRouter()
router.register(r'resources', ResourceViewSet, basename='resource')
router.register(r'services', ServiceViewSet, basename='service')

urlpatterns = [
    path('users/sync/', sync_user, name='sync_user'),
    path('', include(router.urls)),
]
