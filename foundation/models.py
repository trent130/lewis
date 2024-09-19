from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Chat(models.Model):
    user = models.ManyToManyField(User, on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField()
    

    def __str__(self):
        return self.message
    
    def is_read(self):
        return self.is_read == False
class Memorial(models.Model):
    name = models.CharField(max_length=255)
    tribute = models.TextField()
    date_of_birth = models.DateField()
    date_of_passing = models.DateField()

    def __str__(self):
        return self.name

class Donation(models.Model):
    donor_name = models.CharField(max_length=255)
    email = models.EmailField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    message = models.TextField(blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.donor_name} - {self.amount}"
