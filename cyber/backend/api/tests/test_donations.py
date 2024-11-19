from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from ..models import Donation
import stripe
from unittest.mock import patch

User = get_user_model()

class DonationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='donor@example.com',
            password='testpass123',
            is_active=True
        )
        self.client.force_authenticate(user=self.user)

    @patch('stripe.PaymentIntent.create')
    def test_create_payment_intent(self, mock_create):
        mock_create.return_value = type('obj', (object,), {'client_secret': 'test_secret'})
        
        url = reverse('donation-create-payment-intent')
        response = self.client.post(url, {'amount': 1000})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('clientSecret', response.data)

    @patch('stripe.Webhook.construct_event')
    def test_stripe_webhook(self, mock_construct_event):
        payment_intent = {
            'id': 'pi_test',
            'amount': 1000,
            'metadata': {'user_id': self.user.id}
        }
        mock_construct_event.return_value = {
            'type': 'payment_intent.succeeded',
            'data': {'object': payment_intent}
        }
        
        url = reverse('stripe-webhook')
        response = self.client.post(
            url,
            data='{}',
            content_type='application/json',
            HTTP_STRIPE_SIGNATURE='test_sig'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            Donation.objects.filter(stripe_payment_id='pi_test').exists()
        )
