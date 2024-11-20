from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'user_type')
        read_only_fields = ('id',)

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    username = serializers.CharField(required=False)  # Make username optional
    
    class Meta:
        model = User
        fields = ('id', 'username' ,'email', 'password', 'user_type', 'first_name', 'last_name')
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'required': False}
        }

    def create(self, validated_data):
        # Generate username from email
        email = validated_data['email']
        base_username = email.split('@')[0]
        username = base_username
        counter = 1
        
        # Ensure unique username
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
            
        # Add username to validated_data
        validated_data['username'] = username
        
        try:
            user = User.objects.create_user(**validated_data)
            return user
        except Exception as e:
            raise serializers.ValidationError(str(e))

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'user_type': self.user.user_type
        }
        return data
