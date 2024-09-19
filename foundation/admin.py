from django.contrib import admin
from .models import Chat

# Register your models here.
class ChatAdmin(admin.ModelAdmin):
    list_display = ['user', 'message', 'created_at']
    list_filter = ['user', 'message', 'is_read']
    prepopulated_fields = {['slug', ('created_at', 'is_read', 'message[:10]')]}
    search_fields = ['user', 'message']

admin.site.register(Chat, ChatAdmin)
