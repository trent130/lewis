from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from ..auth_utils import generate_verification_token

User = get_user_model()

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('token_obtain_pair')
        self.user_data = {
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User',
            'user_type': 'patient'
        }

    def test_user_registration(self):
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(User.objects.filter(email=self.user_data['email']).exists())

    def test_user_login(self):
        # Create and verify user
        user = User.objects.create_user(
            email=self.user_data['email'],
            password=self.user_data['password'],
            is_active=True
        )
        
        response = self.client.post(self.login_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_email_verification(self):
        # Create unverified user
        user = User.objects.create_user(
            email=self.user_data['email'],
            password=self.user_data['password'],
            is_active=False
        )
        
        token = generate_verification_token(user)
        verify_url = reverse('verify-email')
        
        response = self.client.post(verify_url, {'token': token})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        user.refresh_from_db()
        self.assertTrue(user.is_active)
