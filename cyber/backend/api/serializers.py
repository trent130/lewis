from rest_framework import serializers
from .models import (
    Event, EventRegistration, Donation, RecurringDonation,
    Contact, Newsletter, ForumPost, ForumComment
)
from users.serializers import UserSerializer

class EventRegistrationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = EventRegistration
        fields = ('id', 'event', 'user', 'registered_at')
        read_only_fields = ('registered_at',)

class EventSerializer(serializers.ModelSerializer):
    registrations = EventRegistrationSerializer(many=True, read_only=True)
    
    class Meta:
        model = Event
        fields = ('id', 'title', 'description', 'date', 'location', 
                 'created_at', 'updated_at', 'registrations')
        read_only_fields = ('created_at', 'updated_at')

class DonationSerializer(serializers.ModelSerializer):
    donor = UserSerializer(read_only=True)
    
    class Meta:
        model = Donation
        fields = ('id', 'donor', 'amount', 'stripe_payment_id', 
                 'anonymous', 'created_at')
        read_only_fields = ('created_at', 'stripe_payment_id')

class RecurringDonationSerializer(serializers.ModelSerializer):
    donor = UserSerializer(read_only=True)
    
    class Meta:
        model = RecurringDonation
        fields = ('id', 'donor', 'amount', 'frequency', 'active', 
                 'stripe_subscription_id', 'created_at')
        read_only_fields = ('created_at', 'stripe_subscription_id')

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ('id', 'name', 'email', 'message', 'created_at')
        read_only_fields = ('created_at',)

class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Newsletter
        fields = ('id', 'email', 'subscribed_at', 'is_active')
        read_only_fields = ('subscribed_at',)

class ForumCommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = ForumComment
        fields = ('id', 'post', 'author', 'content', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

class ForumPostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments = ForumCommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = ForumPost
        fields = ('id', 'author', 'title', 'content', 'created_at', 
                 'updated_at', 'comments')
        read_only_fields = ('created_at', 'updated_at')
