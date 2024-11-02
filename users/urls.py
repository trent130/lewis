from django.urls import path
from . import views

urlpatterns = [
    path('get_csrf/', views.csrfTokenView, name='get_csrf'),
    path('login/', views.UserLoginView.as_view(), name='login'),
    path('register/', views.UserRegistrationView.as_view(), name='register'),
]