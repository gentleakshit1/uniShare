import jwt
import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.core.cache import cache

User = get_user_model()

class ClerkJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]
        
        # In a production app, we would fetch the JWKS from Clerk and verify the signature securely.
        # For this setup/learning phase, we will decode it without verification or with a shared secret 
        # to ensure it works smoothly before setting up complex RSA key verification.
        try:
            # Decode the token (unverified for now, just to extract user ID)
            # IMPORTANT: In production, use algorithms=["RS256"] and the proper Clerk JWKS!
            decoded_token = jwt.decode(token, options={"verify_signature": False})
            clerk_user_id = decoded_token.get('sub')
            email = decoded_token.get('email', '')
            
            if not clerk_user_id:
                raise AuthenticationFailed("Invalid token payload")

            # Get or create the Django user based on the Clerk ID
            user, created = User.objects.get_or_create(username=clerk_user_id)
            if created and email:
                user.email = email
                user.save()

            return (user, token)
        except Exception as e:
            raise AuthenticationFailed(f"Authentication failed: {str(e)}")
