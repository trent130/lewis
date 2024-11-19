from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from django.conf import settings

schema_view = get_schema_view(
    openapi.Info(
        title="Sickle Cell Foundation API",
        default_version='v1',
        description="API documentation for Sickle Cell Foundation",
        terms_of_service="https://www.sicklecell.org/terms/",
        contact=openapi.Contact(email="contact@sicklecell.org"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)
