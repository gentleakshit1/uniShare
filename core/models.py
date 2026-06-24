from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Resource(models.Model):
    CATEGORY_CHOICES = [
        ('notes', 'Notes'),
        ('paper', 'Previous Year Paper'),
        ('assignment', 'Assignment'),
        ('other', 'Other'),
    ]

    SEMESTER_CHOICES = [(str(i), f"Semester {i}") for i in range(1, 9)]

    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='resources/')
    course = models.CharField(max_length=100)
    semester = models.CharField(max_length=10, choices=SEMESTER_CHOICES)
    subject = models.CharField(max_length=100)
    type = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    uploader_display_name = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Metrics & Marketplace fields
    downloads_count = models.IntegerField(default=0)
    upvotes = models.IntegerField(default=0)
    downvotes = models.IntegerField(default=0)
    is_for_sale = models.BooleanField(default=False)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_anonymous = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    @property
    def preview_url(self):
        if not self.file:
            return None
        url = self.file.url
        if url.lower().endswith('.pdf'):
            # Replace the .pdf extension with .jpg to get the Cloudinary PDF thumbnail
            return url.rsplit('.', 1)[0] + '.jpg'
        return url


class Vote(models.Model):
    VOTE_CHOICES = [
        ('UP', 'Upvote'),
        ('DOWN', 'Downvote')
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='votes')
    vote_type = models.CharField(max_length=4, choices=VOTE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'resource')

    def __str__(self):
        return f"{self.user.username} - {self.resource.title} - {self.vote_type}"

class Service(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    provider = models.ForeignKey(User, on_delete=models.CASCADE, related_name='services')
    provider_display_name = models.CharField(max_length=255, null=True, blank=True)
    provider_image_url = models.URLField(max_length=500, null=True, blank=True)
    contact_info = models.CharField(max_length=255, help_text="Email or Phone number for contact")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15)

    def __str__(self):
        return f"{self.user.username}'s profile"