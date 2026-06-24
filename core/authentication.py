import jwt
import requests
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from cryptography.hazmat.primitives.asymmetric.rsa import RSAPublicNumbers
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
import base64

User = get_user_model()

# Using the domain from your frontend's Publishable Key
JWKS_URL = 'https://optimal-mustang-94.clerk.accounts.dev/.well-known/jwks.json'

def ensure_bytes(key):
    if isinstance(key, str):
        key = key.encode('utf-8')
    return key

def decode_value(val):
    decoded = base64.urlsafe_b64decode(ensure_bytes(val) + b'==')
    return int.from_bytes(decoded, 'big')

def rsa_pem_from_jwk(jwk):
    public_num = RSAPublicNumbers(
        n=decode_value(jwk['n']),
        e=decode_value(jwk['e'])
    )
    public_key = public_num.public_key(default_backend())
    pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    return pem

class ClerkAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]

        try:
            unverified_header = jwt.get_unverified_header(token)
            kid = unverified_header.get('kid')
            
            # Fetch JWKS
            jwks_response = requests.get(JWKS_URL)
            jwks_response.raise_for_status()
            jwks = jwks_response.json()
            
            rsa_key = None
            for key in jwks['keys']:
                if key['kid'] == kid:
                    rsa_key = rsa_pem_from_jwk(key)
                    break
            
            if not rsa_key:
                raise AuthenticationFailed('Unable to find appropriate key.')
            
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=['RS256'],
                options={"verify_aud": False} # We disable audience validation for local dev flexibility
            )
            
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token signature has expired.')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token.')
        except Exception as e:
            raise AuthenticationFailed(f"Auth error: {str(e)}")
            
        clerk_id = payload.get('sub')
        
        # Local User Sync: We create a Django user using the Clerk ID as the username.
        # This allows the backend to track which user voted or uploaded a file!
        user, created = User.objects.get_or_create(username=clerk_id)
        
        return (user, token)
