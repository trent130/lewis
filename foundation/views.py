from django.shortcuts import render, redirect
from django.urls import reverse
from users.models import CustomUser
from .forms import ChatForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from .models import Chat, Memorial, Donation
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Donation, RecentDonation
from .serializers import DonationSerializer, RecentDonationSerializer
from rest_framework import status

# Create your views here.
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

# def chatview(request):
#     chats = Chat.objects.all()
#     return render(request, 'foundation/chatview.html', {'chats':chats})

# def home(request):
#     return render(request, 'foundation/home.html')

# def memorial(request):
#     memorial_entries = Memorial.objects.all()
#     return render(request, 'foundation/memorial.html', {'memorial_entries': memorial_entries})

# def donate(request):
#     if request.method == 'POST':
#         # Handle donation form submission
#         pass
#     return render(request, 'foundation/donate.html')

class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer

@api_view(['GET'])
def recent_donations(request):
    # Fetch recent donations (this can be filtered to your needs)
    recent_donations = RecentDonation.objects.all().order_by('-viewed_at')[:10]  # Fetch top 10 recent donations
    serializer = RecentDonationSerializer(recent_donations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)