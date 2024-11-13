from rest_framework import serializers
from .models import Donation, RecentDonation

class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = ['id', 'donor_name', 'email', 'amount', 'message', 'date']

class RecentDonationSerializer(serializers.ModelSerializer):
    donation = DonationSerializer()

    class Meta:
        model = RecentDonation
        fields = ['id', 'donation', 'viewed_at']
