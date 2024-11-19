from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from unittest.mock import patch, MagicMock
import json
import stripe
from ..models import Donation

User = get_user_model()

class WebhookTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.webhook_url = reverse('stripe-webhook')
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )

    @patch('stripe.Webhook.construct_event')
    def test_successful_payment_webhook(self, mock_construct_event):
        payment_intent = {
            'id': 'pi_test_123',
            'amount': 5000,  # $50.00
            'metadata': {
                'user_id': str(self.user.id),
                'anonymous': False
            }
        }
        
        mock_construct_event.return_value = {
            'type': 'payment_intent.succeeded',
            'data': {'object': payment_intent}
        }

        response = self.client.post(
            self.webhook_url,
            data=json.dumps(payment_intent),
            content_type='application/json',
            HTTP_STRIPE_SIGNATURE='test_signature'
        )

        self.assertEqual(response.status_code, 200)
        donation = Donation.objects.first()
        self.assertIsNotNone(donation)
        self.assertEqual(donation.amount, 50.00)
        self.assertEqual(donation.donor, self.user)

    @patch('stripe.Webhook.construct_event')
    def test_failed_payment_webhook(self, mock_construct_event):
        payment_intent = {
            'id': 'pi_test_failed',
            'amount': 5000,
            'metadata': {
                'user_id': str(self.user.id)
            }
        }
        
        mock_construct_event.return_value = {
            'type': 'payment_intent.payment_failed',
            'data': {'object': payment_intent}
        }

        response = self.client.post(
            self.webhook_url,
            data=json.dumps(payment_intent),
            content_type='application/json',
            HTTP_STRIPE_SIGNATURE='test_signature'
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(Donation.objects.count(), 0)

    def test_invalid_signature(self):
        response = self.client.post(
            self.webhook_url,
            data='{}',
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
