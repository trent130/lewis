from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth.models import User
from .forms import ChatForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from .models import Chat

# Create your views here.
def home(request):
    return render(request, 'foundation/home.html')

@login_required
def chat(request):
    if request.method == 'POST':
        form = ChatForm(request.post, request.FILES, instance=request.user)
        if form.is_valid():
            form = form.save(commit=False)
            form.user = request.user
            form.save()
            messages.success(request, "Message added")
            return redirect(reverse('foundation:chat'))
        else:
            return redirect(reverse('foundation:chat'))
    else:
        form = ChatForm(instance=request.user)
    context = {'form': form, }
    return render(request, 'foundation/chat.html', context)

def chatview(request):
    chats = Chat.objects.all()
    return render(request, 'foundation/chatview.html', {'chats':chats})
