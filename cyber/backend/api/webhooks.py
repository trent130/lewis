import stripe
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.core.mail import send_mail
from .models import Donation, User
import logging

logger = logging.getLogger(__name__)
stripe.api_key = settings.STRIPE_SECRET_KEY

WEBHOOK_HANDLERS = {
    'payment_intent.succeeded': 'handle_successful_payment',
    'payment_intent.payment_failed': 'handle_failed_payment',
    'customer.subscription.created': 'handle_subscription_created',
    'customer.subscription.updated': 'handle_subscription_updated',
    'customer.subscription.deleted': 'handle_subscription_deleted',
}

@csrf_exempt
@require_POST
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        return HttpResponse(status=400)

    event_handler = WEBHOOK_HANDLERS.get(event['type'])
    if event_handler:
        try:
            handler = globals()[event_handler]
            response = handler(event['data']['object'])
            return HttpResponse(status=200)
        except Exception as e:
            logger.error(f"Handler error: {str(e)}")
            return HttpResponse(status=500)
    
    return HttpResponse(status=200)

def handle_successful_payment(payment_intent):
    amount = payment_intent['amount'] / 100
    metadata = payment_intent.get('metadata', {})
    
    donation = Donation.objects.create(
        stripe_payment_id=payment_intent['id'],
        amount=amount,
        donor_id=metadata.get('user_id'),
        anonymous=metadata.get('anonymous', False)
    )

    # Send thank you email
    if not donation.anonymous and donation.donor:
        send_thank_you_email(donation)

    return True

def handle_failed_payment(payment_intent):
    logger.error(f"Failed payment: {payment_intent['id']}")
    metadata = payment_intent.get('metadata', {})
    user_id = metadata.get('user_id')
    
    if user_id:
        user = User.objects.get(id=user_id)
        send_mail(
            'Payment Failed',
            'Your donation payment has failed. Please try again or contact support.',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
    
    return True

def handle_subscription_created(subscription):
    # Handle monthly donor subscriptions
    customer = stripe.Customer.retrieve(subscription.customer)
    metadata = subscription.get('metadata', {})
    
    user = User.objects.get(id=metadata.get('user_id'))
    user.is_monthly_donor = True
    user.save()
    
    return True

def handle_subscription_updated(subscription):
    # Handle subscription updates
    metadata = subscription.get('metadata', {})
    user = User.objects.get(id=metadata.get('user_id'))
    
    if subscription.status == 'active':
        user.is_monthly_donor = True
    else:
        user.is_monthly_donor = False
    user.save()
    
    return True

def handle_subscription_deleted(subscription):
    metadata = subscription.get('metadata', {})
    user = User.objects.get(id=metadata.get('user_id'))
    user.is_monthly_donor = False
    user.save()
    
    return True

def send_thank_you_email(donation):
    subject = 'Thank You for Your Donation'
    message = f"""
    Dear {donation.donor.first_name},

    Thank you for your generous donation of ${donation.amount} to the Sickle Cell Foundation.
    Your support helps us continue our mission to support those affected by Sickle Cell Anemia.

    Best regards,
    Sickle Cell Foundation Team
    """
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [donation.donor.email],
        fail_silently=False,
    )

