from django.urls import path
from foundation import views

urlpatterns = [
    # path('', views.home, name='home'),
    # path('about/', views.about, name='about'),
    # path('contact/', views.contact, name='contact'),
    # path('services/', views.services, name='services'),
    # path('portfolio/', views.portfolio, name='portfolio'),
    # path('blog/', views.blog, name='blog'),
    # path('blog-details/', views.blog_details, name='blog-details'),
    # path('error-404/', views.error_404, name='error-404'),
    path('recent/', views.recent_donations, name='recent-donations'),
]