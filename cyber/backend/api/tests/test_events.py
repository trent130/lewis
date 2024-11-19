from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from ..models import Event
from datetime import datetime, timedelta

User = get_user_model()

class EventTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            is_active=True
        )
        self.event = Event.objects.create(
            title='Test Event',
            description='Test Description',
            date=datetime.now() + timedelta(days=7),
            location='Test Location',
            available_spots=50
        )
        self.client.force_authenticate(user=self.user)

    def test_list_events(self):
        response = self.client.get(reverse('event-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_event(self):
        data = {
            'title': 'New Event',
            'description': 'New Description',
            'date': datetime.now() + timedelta(days=14),
            'location': 'New Location',
            'available_spots': 100
        }
        response = self.client.post(reverse('event-list'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_for_event(self):
        url = reverse('event-register', kwargs={'pk': self.event.pk})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(self.event.registrations.filter(user=self.user).exists())

    def test_duplicate_registration(self):
        self.event.registrations.create(user=self.user)
        url = reverse('event-register', kwargs={'pk': self.event.pk})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
