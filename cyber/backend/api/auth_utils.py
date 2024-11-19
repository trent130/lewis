from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
import jwt
from datetime import datetime, timedelta

User = get_user_model()

def generate_verification_token(user):
    """Generate email verification token"""
    payload = {
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(days=1),
        'type': 'email_verification'
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

def verify_token(token, token_type):
    """Verify token and return user"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        if payload['type'] != token_type:
            return None
        user = User.objects.get(id=payload['user_id'])
        return user
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, User.DoesNotExist):
        return None

def send_verification_email(user, verification_url):
    """Send email verification link"""
    subject = 'Verify your email address'
    html_message = render_to_string('emails/verify_email.html', {
        'user': user,
        'verification_url': verification_url
    })
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        html_message=html_message,
        fail_silently=False,
    )

def send_password_reset_email(user, reset_url):
    """Send password reset link"""
    subject = 'Reset your password'
    html_message = render_to_string('emails/reset_password.html', {
        'user': user,
        'reset_url': reset_url
    })
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        html_message=html_message,
        fail_silently=False,
    )
