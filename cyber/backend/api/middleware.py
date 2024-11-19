from django.http import HttpResponseForbidden
import re
from django.conf import settings

class SecurityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Check for suspicious SQL injection patterns
        if self._contains_sql_injection(request):
            return HttpResponseForbidden("Suspicious request detected")

        # Add security headers
        response = self.get_response(request)
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        
        return response

    def _contains_sql_injection(self, request):
        sql_patterns = [
            r'(\s|^)(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)(\s|$)',
            r'--',
            r';',
            r'\/\*.*\*\/',
        ]
        
        params = request.GET.dict()
        params.update(request.POST.dict())
        
        for value in params.values():
            if isinstance(value, str):
                for pattern in sql_patterns:
                    if re.search(pattern, value, re.IGNORECASE):
                        return True
        return False
