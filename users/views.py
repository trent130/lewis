from django.shortcuts import render
from django.middleware.csrf import get_token
from django.http import JsonResponse
from.serializers import CustomUserSerializer, LoginSerializer
from rest_framework import generics, status, permissions 
from rest_framework.response import Response
from .models import CustomUser
from django.contrib.auth import logout

# Create your views here.

def csrfTokenView(request):
    return JsonResponse({'csrfToken': get_token(request)})

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]
    queryset = CustomUser.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer
    queryset = CustomUser.objects.all()

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']
            return Response({
                'message': "Login sucessful!",
                'user': {
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                },
            }, status = status.HTTP_200_OK)

def authentificationView(request):
    if is_authenticated:
        return JsonResponse({'username': request.username})