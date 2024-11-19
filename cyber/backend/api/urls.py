from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'events', views.EventViewSet)
router.register(r'donations', views.DonationViewSet)
router.register(r'recurring-donations', views.RecurringDonationViewSet)
router.register(r'event-registrations', views.EventRegistrationViewSet)
router.register(r'forum/posts', views.ForumPostViewSet)
router.register(r'newsletter', views.NewsletterViewSet)
router.register(r'contact', views.ContactViewSet)

urlpatterns = [
    path('', include(router.urls)),
]