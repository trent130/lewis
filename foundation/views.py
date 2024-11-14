from users.models import CustomUser
from .forms import ChatForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import Chat, Memorial, Donation
from rest_framework import generics
from rest_framework import permissions
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

class DonationsView(generics.ListAPIView):
    queryset = Donation.objects.all().order_by('-date')  # Add this line
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]  # Changed from DjangoModelPermissionsOrAnonReadOnly
    
    def get_queryset(self):
        # You can customize the queryset here if needed
        return Donation.objects.all().order_by('-date')[:10]  # Get last 10 donations


class RecentDonationsView(generics.ListAPIView):
    queryset = RecentDonation.objects.all().order_by('-viewed_at')[:10]
    serializer_class = RecentDonationSerializer
    
    def get_queryset(self):
        return RecentDonation.objects.all().order_by('-viewed_at')[:10]  # Fetch top 10 recent donations