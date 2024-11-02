from django.urls import path
from . import views
from django.contrib.auth.views import LogoutView

urlpatterns = [
    path('get_csrf/', views.csrfTokenView, name='get_csrf'),
    path('login/', views.UserLoginView.as_view(), name='login'),
    path('register/', views.UserRegistrationView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name="logout"),
    path('me/', views.authentificationView, name='me'),
]