from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
import stripe
from api.models import Donation, RecurringDonation, Event, EventRegistration, Contact, Newsletter, ForumPost, ForumComment
from .serializers import (
    EventSerializer, DonationSerializer, 
    ForumPostSerializer, ForumCommentSerializer,
    NewsletterSerializer, ContactSerializer, 
    RecurringDonationSerializer, EventRegistrationSerializer
)

stripe.api_key = settings.STRIPE_SECRET_KEY

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['post'])
    def register(self, request, pk=None):
        event = self.get_object()
        if event.registrations.filter(user=request.user).exists():
            return Response(
                {'error': 'Already registered'},
                status=status.HTTP_400_BAD_REQUEST
            )
        event.registrations.create(user=request.user)
        return Response({'status': 'registered'})

class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['post'])
    def create_payment_intent(self, request):
        try:
            amount = request.data.get('amount')
            if not amount:
                raise ValueError('Amount is required')

            intent = stripe.PaymentIntent.create(
                amount=int(amount),
                currency='usd',
                metadata={'integration_check': 'accept_a_payment'}
            )

            return Response({
                'clientSecret': intent.client_secret
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class ForumPostViewSet(viewsets.ModelViewSet):
    queryset = ForumPost.objects.all()
    serializer_class = ForumPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        post = self.get_object()
        serializer = ForumCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(post=post, author=request.user)
            return Response(serializer.data)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class NewsletterViewSet(viewsets.ModelViewSet):
    queryset = Newsletter.objects.all()
    serializer_class = NewsletterSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    @action(detail=False, methods=['post'])
    def unsubscribe(self, request):
        email = request.data.get('email')
        try:
            subscription = Newsletter.objects.get(email=email)
            subscription.is_active = False
            subscription.save()
            return Response({'message': 'Successfully unsubscribed'})
        except Newsletter.DoesNotExist:
            return Response(
                {'error': 'Subscription not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

class RecurringDonationViewSet(viewsets.ModelViewSet):
    queryset = RecurringDonation.objects.all()
    serializer_class = RecurringDonationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(donor=self.request.user)

    @action(detail=True, methods=['post'])
    def cancel_subscription(self, request, pk=None):
        recurring_donation = self.get_object()
        if recurring_donation.donor != request.user:
            return Response(
                {'error': 'Not authorized'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            stripe.Subscription.delete(recurring_donation.stripe_subscription_id)
            recurring_donation.active = False
            recurring_donation.save()
            return Response({'message': 'Subscription cancelled successfully'})
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class EventRegistrationViewSet(viewsets.ModelViewSet):
    queryset = EventRegistration.objects.all()
    serializer_class = EventRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        if self.request.user.is_staff:
            return EventRegistration.objects.all()
        return EventRegistration.objects.filter(user=self.request.user)
