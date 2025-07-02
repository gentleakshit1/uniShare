"""
URL configuration for unishare project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from core.views import upload_resource, resource_list, delete_resource
from django.conf import settings
from django.conf.urls.static import static
from core.views import user_dashboard
from core import views



urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('upload/', upload_resource, name='upload_resource'),
    path('', resource_list, name='resource_list'), 
    path('delete/<int:resource_id>/', delete_resource, name='delete_resource'),
    path('dashboard/', user_dashboard, name='user_dashboard'),
    path('resource/<int:resource_id>/edit/', views.edit_resource, name='edit_resource'),


]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)