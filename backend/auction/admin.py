from django.contrib import admin

from .models import Auction, Bid, Result, Message

# Register your models here.

admin.site.register(Auction)
admin.site.register(Bid)
admin.site.register(Result)
admin.site.register(Message)
