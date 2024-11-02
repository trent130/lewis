from .models import CustomUser
from rest_framework import serializers, status
from django.contrib.auth import authenticate
from rest_framework.response import Response

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = "CustomUser"
        fields = ['id', 'email', 'username', 'password']
        read_only_fields = ['id']

    def create(self, validated_data):
        user = CustomUser(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        user = authenticate(request=self.context.get('request'), username=email, password=password)

        if user is None:
            raise serializers.ValidationError('data mismatch')
        
        data['user'] = user
        return data
