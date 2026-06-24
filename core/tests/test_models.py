from django.test import TestCase
from django.contrib.auth import get_user_model
from core.models import Resource, Service, Vote, UserProfile

User = get_user_model()

class ModelsTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="test_user")

    def test_resource_creation(self):
        resource = Resource.objects.create(
            title="Test Notes",
            course="CS101",
            semester="1",
            subject="Intro to CS",
            type="notes",
            uploaded_by=self.user,
        )
        self.assertEqual(resource.title, "Test Notes")
        self.assertEqual(resource.downloads_count, 0)
        self.assertEqual(str(resource), "Test Notes")

    def test_service_creation(self):
        service = Service.objects.create(
            title="Math Tutoring",
            description="Calculus help",
            price=20.00,
            provider=self.user,
            provider_display_name="Test Tutor",
            contact_info="test@example.com"
        )
        self.assertEqual(service.title, "Math Tutoring")
        self.assertEqual(service.provider_display_name, "Test Tutor")
        self.assertEqual(str(service), "Math Tutoring")
