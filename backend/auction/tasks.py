from __future__ import absolute_import, unicode_literals
from celery import shared_task
from datetime import datetime, timezone, timedelta
from django.db import transaction

from .models import Auction, Bid, Result, Message


def handle_expiration(auction):
    print(f"Expired Auction: {auction.item}")
    if auction.highest_bid != None:
        bid = auction.highest_bid
        result = Result(item=auction.item, creator=auction.created_by, winner=bid.bidder, price=bid.bid, sold=True)
        message1 = Message(receiver=auction.created_by, message=f"Your auction for {auction.item} has been won by {bid.bidder} for £{bid.bid}.")
        message2 = Message(receiver=bid.bidder, message=f"You won the auction for {auction.item} at the price of £{bid.bid} created by {auction.created_by}.")
        result.save()
        message1.save()
        message2.save()
        auction.delete()
    else:
        result = Result(item=auction.item, creator=auction.created_by, price=0, sold=False)
        message = Message(receiver=auction.created_by, message=f"Your auction for {auction.item} has expired without any bidders.")
        result.save()
        message.save()
        auction.delete()

@transaction.atomic
@shared_task(name = "auction_tasks")
def handle_auctions():
    now = datetime.now(timezone.utc)
    auctions = Auction.objects.all()
    for x in auctions:
        expiration = x.pub_date + x.duration
        time_left = expiration - now
        if time_left < timedelta.resolution:
            handle_expiration(x)
