from django.http import HttpResponseForbidden
from django.conf import settings
import re
import logging

logger = logging.getLogger(__name__)

class SecurityHeadersMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Security headers
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        response['Content-Security-Policy'] = "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval';"
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
        
        return response

class SecurityMonitoringMiddleware:
    SUSPICIOUS_PATTERNS = [
        r'(\s|^)(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)(\s|$)',
        r'<script.*?>.*?</script>',
        r'javascript:',
        r'onload=',
        r'onerror=',
    ]

    def __init__(self, get_response):
        self.get_response = get_response
        self.patterns = [re.compile(p, re.I) for p in self.SUSPICIOUS_PATTERNS]

    def __call__(self, request):
        if self._check_suspicious_content(request):
            logger.warning(f'Suspicious request detected from {request.META.get("REMOTE_ADDR")}')
            return HttpResponseForbidden("Suspicious request detected")
        
        return self.get_response(request)

    def _check_suspicious_content(self, request):
        # Check query parameters
        for key, value in request.GET.items():
            if self._is_suspicious(value):
                return True

        # Check POST data
        for key, value in request.POST.items():
            if self._is_suspicious(value):
                return True

        # Check headers
        for key, value in request.META.items():
            if key.startswith('HTTP_'):
                if self._is_suspicious(value):
                    return True

        return False

    def _is_suspicious(self, value):
        if not isinstance(value, str):
            return False
        
        return any(pattern.search(value) for pattern in self.patterns)
