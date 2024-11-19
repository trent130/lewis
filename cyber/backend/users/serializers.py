from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'user_type', 'phone_number', 
                 'bio', 'profile_picture', 'date_of_birth')
        read_only_fields = ('id', 'email')

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'password', 'user_type', 
                 'phone_number', 'date_of_birth')

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user