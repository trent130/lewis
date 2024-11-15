from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import login
from .serializers import CustomUserSerializer, LoginSerializer
from django.utils.decorators import method_decorator
import logging
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser

logger = logging.getLogger(__name__)

@ensure_csrf_cookie
def csrfTokenView(request):
    return JsonResponse({'csrfToken': get_token(request)})

class UserRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            login(request, user)  # Log the user in after registration
            return Response({
                'message': 'Registration successful',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@method_decorator(ensure_csrf_cookie, name='dispatch')
class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    queryset = CustomUser.objects.all()

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            login(request, user)
            
            # Debug session information
            print("Session ID:", request.session.session_key)
            print("Session Data:", dict(request.session))
            print("Is user authenticated?", request.user.is_authenticated)
            
            response = Response({
                'message': "Login successful!",
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                },
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_200_OK)
            
            # Set session cookie
            response.set_cookie(
                key='sessionid',
                value=request.session.session_key,
                httponly=True,
                samesite='Lax',
                secure=True,  # Set to True in production with HTTPS
                max_age=1209600  # 2 weeks in seconds
            )

            # Debug response cookies
            print("Response Cookies:", response.cookies.items())
            
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        logger.info(f"User  ID: {user.id} - Username: {user.username} - Authenticated: {user.is_authenticated}")

        if not user.is_authenticated:
            logger.warning("User  is not authenticated.")
            return Response({'detail': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

        data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            # Uncomment if needed
            # 'first_name': user.first_name,
            # 'last_name': user.last_name,
        }
        return Response(data)