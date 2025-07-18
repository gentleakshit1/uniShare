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
        email = self.cleaned_data.get('email').lower()
        if not email.endswith('.edu'):
            raise ValidationError("Please use a university email ending in '.edu'.")
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
    course = forms.CharField(
        label="Course*",
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your course (e.g. B.Tech CSE)'
        })
    )
    semester = forms.ChoiceField(
        label="Semester*",
        choices=[('', 'Select Semester')] + [(str(i), f"Semester {i}") for i in range(1, 9)],
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    type = forms.ChoiceField(
        label="Type*",
        choices=[
            ('', 'Select Type'),
            ('notes', 'Notes'),
            ('paper', 'Previous Year Paper'),
            ('assignment', 'Assignment'),
            ('other', 'Other')
        ],
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    subject = forms.CharField(
        label="Subject*",
        widget=forms.TextInput(attrs={
            'list': 'subject-list',
            'class': 'form-control',
            'placeholder': 'Start typing subject...'
        })
    )

    class Meta:
        model = Resource
        fields = ['title', 'file', 'course', 'semester', 'subject', 'type']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        subjects = Resource.objects.values_list('subject', flat=True).distinct()
        self.subject_suggestions = list(subjects)

    def clean_file(self):
        file = self.cleaned_data.get('file')
        if hasattr(file, 'content_type'):
            allowed_types = [
                'application/pdf',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'image/jpeg',
                'image/png'
            ]
            max_size = 5 * 1024 * 1024  # 5 MB limit

            if file.content_type not in allowed_types:
                raise forms.ValidationError("Only PDF, DOCX, JPG or PNG files are allowed.")

            if file.size > max_size:
                raise forms.ValidationError("File size must be under 5 MB for images.")

        return file

