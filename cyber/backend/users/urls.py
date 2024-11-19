from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('login/', views.UserLoginView.as_view(), name='user-login'),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('logout/', views.UserLogoutView.as_view(), name='user-logout'),
    path('token/', TokenRefreshView.as_view(), name='token_refresh'),
]
