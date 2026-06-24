from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from core.models import Resource, Service

User = get_user_model()

class APITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(username="test_user")
        
        # Force authenticate the client with DRF to bypass the Bearer token check
        self.client.force_authenticate(user=self.user)
        
        self.resource = Resource.objects.create(
            title="API Test Notes",
            course="CS101",
            semester="1",
            subject="Intro to CS",
            type="notes",
            uploaded_by=self.user,
        )
        
        self.service = Service.objects.create(
            title="API Test Tutoring",
            description="API Test Calculus help",
            price=20.00,
            provider=self.user,
            contact_info="api@example.com"
        )

    def test_get_resources(self):
        response = self.client.get('/api/resources/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)

    def test_get_services(self):
        response = self.client.get('/api/services/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)

    def test_vote_resource(self):
        response = self.client.post(f'/api/resources/{self.resource.id}/vote/', {'vote_type': 'UP'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['upvotes'], 1)
        
    def test_download_resource(self):
        response = self.client.post(f'/api/resources/{self.resource.id}/download/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['downloads_count'], 1)

    def test_create_service(self):
        data = {
            "title": "New Freelance Web Dev",
            "description": "I will build your site",
            "price": "500.00",
            "contact_info": "dev@test.com",
            "provider_display_name": "Pro Dev",
            "provider_image_url": "http://example.com/img.png"
        }
        response = self.client.post('/api/services/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Service.objects.count(), 2)
        self.assertEqual(Service.objects.latest('id').title, "New Freelance Web Dev")
