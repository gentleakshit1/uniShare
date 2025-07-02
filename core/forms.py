from allauth.account.forms import SignupForm
from django import forms
from django.core.exceptions import ValidationError
from .models import UserProfile, Resource

class UniversitySignupForm(SignupForm):
    phone = forms.CharField(
        max_length=15,
        required=True,
        label='Phone Number',
        widget=forms.TextInput(attrs={'placeholder': 'Enter your phone number'})
    )

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not email.endswith('@s.amity.edu'):
            raise ValidationError("Please use your university email address.")
        return email

    def clean_phone(self):
        phone = self.cleaned_data.get('phone')
        if not phone.isdigit():
            raise ValidationError("Phone number must contain only digits.")
        if len(phone) != 10:
            raise ValidationError("Enter a valid phone number")
        return phone

    def save(self, request):
        user = super().save(request)
        UserProfile.objects.create(user=user, phone=self.cleaned_data['phone'])
        return user



class ResourceUploadForm(forms.ModelForm):
    subject = forms.CharField(
        widget=forms.TextInput(attrs={
            'list': 'subject-list',
            'class': 'form-control',
            'placeholder': 'Start typing subject...'
        })
    )

    class Meta:
        model = Resource
        fields = ['title', 'description', 'file', 'category', 'subject']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        subjects = Resource.objects.values_list('subject', flat=True).distinct()
        self.subject_suggestions = list(subjects)

    def clean_file(self):
        file = self.cleaned_data.get('file')

    # Only perform validation if it's a new uploaded file
        if hasattr(file, 'content_type'):
            allowed_types = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
            max_size = 10 * 1024 * 1024  # 10 MB

            if file.content_type not in allowed_types:
                raise forms.ValidationError("Only PDF or DOCX files are allowed.")

            if file.size > max_size:
                raise forms.ValidationError("File size must be under 10 MB.")

        return file
