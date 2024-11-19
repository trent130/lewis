from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.conf import settings
from .serializers import UserSerializer
from .auth_utils import (
    generate_verification_token,
    verify_token,
    send_verification_email,
    send_password_reset_email
)

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save(is_active=False)  # User inactive until email verified
        token = generate_verification_token(user)
        verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
        send_verification_email(user, verification_url)
        
        return Response({
            'message': 'Registration successful. Please check your email to verify your account.'
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email(request):
    token = request.data.get('token')
    user = verify_token(token, 'email_verification')
    
    if user:
        user.is_active = True
        user.email_verified = True
        user.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Email verified successfully',
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })
    return Response(
        {'error': 'Invalid or expired token'},
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    
    if not user.check_password(old_password):
        return Response(
            {'error': 'Current password is incorrect'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user.set_password(new_password)
    user.save()
    return Response({'message': 'Password changed successfully'})

@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    try:
        email = request.data.get('email')
        user = User.objects.get(email=email)
        token = generate_verification_token(user)
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        send_password_reset_email(user, reset_url)
        return Response({'message': 'Password reset email sent'})
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    token = request.data.get('token')
    new_password = request.data.get('new_password')
    
    user = verify_token(token, 'password_reset')
    if not user:
        return Response(
            {'error': 'Invalid or expired token'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user.set_password(new_password)
    user.save()
    return Response({'message': 'Password reset successful'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    try:
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        
        # Validate token and get user
        token_obj = RefreshToken(token)
        user_id = token_obj['user_id']
        user = User.objects.get(id=user_id)
        
        user.set_password(new_password)
        user.save()
        
        return Response({'message': 'Password reset successful'})
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )