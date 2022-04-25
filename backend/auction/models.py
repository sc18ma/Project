from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.

User = get_user_model()

class Auction(models.Model):
    item = models.CharField(max_length=200)
    description = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    starting_price = models.DecimalField(decimal_places=2, max_digits=10, default=0)
    pub_date = models.DateTimeField('date published')
    duration = models.DurationField()
    highest_bid = models.ForeignKey('Bid', related_name='best_bid', on_delete=models.SET_NULL, blank=True, null=True, default=None)

class Bid(models.Model):
    auction = models.ForeignKey('Auction', related_name='auction_name', on_delete=models.CASCADE)
    bidder = models.ForeignKey(User, on_delete=models.CASCADE)
    bid = models.DecimalField(decimal_places=2, max_digits=10)
    pub_date = models.DateTimeField('date published')

class Result(models.Model):
    item = models.CharField(max_length=200)
    creator = models.ForeignKey(User, related_name='creator', on_delete=models.CASCADE)
    winner = models.ForeignKey(User, related_name='winner', on_delete=models.CASCADE, blank=True, null=True, default=None)
    price = models.DecimalField(decimal_places=2, max_digits=10)
    sold = models.BooleanField()

class Message(models.Model):
    receiver = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
