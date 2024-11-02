from django.shortcuts import render, redirect
from django.urls import reverse
from users.models import CustomUser
from .forms import ChatForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from .models import Chat, Memorial, Donation

# Create your views here.
def home(request):
    return render(request, 'foundation/home.html')

@login_required
def chat(request):
    pass
    # if request.method == 'POST':
    #     form = ChatForm(request.post, request.FILES, instance=request.customuser)
    #     if form.is_valid():
    #         form = form.save(commit=False)
    #         form.user = request.customuser
    #         form.save()
    #         messages.success(request, "Message added")
    #         return redirect(reverse('foundation:chat'))
    #     else:
    #         return redirect(reverse('foundation:chat'))
    # else:
    #     form = ChatForm(instance=request.customuser)
    # context = {'form': form, }
    # return render(request, 'foundation/chat.html', context)

def chatview(request):
    chats = Chat.objects.all()
    return render(request, 'foundation/chatview.html', {'chats':chats})

def home(request):
    return render(request, 'foundation/home.html')

def memorial(request):
    memorial_entries = Memorial.objects.all()
    return render(request, 'foundation/memorial.html', {'memorial_entries': memorial_entries})

def donate(request):
    if request.method == 'POST':
        # Handle donation form submission
        pass
    return render(request, 'foundation/donate.html')
