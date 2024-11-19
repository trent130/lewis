from django.core.cache import cache
from rest_framework.throttling import SimpleRateThrottle
from django.conf import settings

class CustomRateThrottle(SimpleRateThrottle):
    """
    Custom rate throttle with different rates for authenticated and anonymous users
    """
    cache_format = 'throttle_%(scope)s_%(ident)s'

    def get_cache_key(self, request, view):
        if request.user.is_authenticated:
            ident = request.user.pk
        else:
            ident = self.get_ident(request)

        return self.cache_format % {
            'scope': self.scope,
            'ident': ident
        }

class BurstRateThrottle(CustomRateThrottle):
    scope = 'burst'
    rate = '60/min'  # Authenticated users
    THROTTLE_RATES = {
        'burst_anonymous': '30/min',  # Anonymous users
    }

class SustainedRateThrottle(CustomRateThrottle):
    scope = 'sustained'
    rate = '1000/day'  # Authenticated users
    THROTTLE_RATES = {
        'sustained_anonymous': '500/day',  # Anonymous users
    }
