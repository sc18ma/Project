# Serializers are a part of django-rest-framework and
# are used to conver convert python data to and from JSON
# for communication between frontend and backend


from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone

from .models import Auction, Bid, Message

User = get_user_model()

# Used for retrieving user data
class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'email')

# Used for creating new user accounts
class UserCreateSerializer(serializers.ModelSerializer):

    username = serializers.CharField()
    email = serializers.EmailField(required=True)
    password = serializers.CharField(min_length=8, write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


# Used for creating new Auctions
class AuctionSerializer(serializers.ModelSerializer):
    item = serializers.CharField(max_length=200)
    description = serializers.CharField()
    created_by = serializers.PrimaryKeyRelatedField(read_only=False, queryset=User.objects.all())
    starting_price = serializers.DecimalField(decimal_places=2, max_digits=10, default=0)
    duration = serializers.DurationField()

    class Meta:
        model = Auction
        fields = ('item', 'description', 'created_by', 'starting_price', 'duration')

    def create(self, validated_data):
        validated_data.update({"pub_date": timezone.now()})
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance




# Nested serializers for retrieving auctions with their related highest bid
class BidSerializer(serializers.ModelSerializer):
    auction = serializers.PrimaryKeyRelatedField(read_only=False, queryset=Auction.objects.all())
    bid = serializers.DecimalField(decimal_places=2, max_digits=10)

    class Meta:
        model = Bid
        fields = ('auction', 'bid')

    # Used for creating new bids
    def create(self, validated_data):
        validated_data.update({"pub_date": timezone.now()})
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance

class AuctionDetailsSerializer(serializers.ModelSerializer):
    highest_bid = BidSerializer(many=False, read_only=True)

    class Meta:
        model = Auction
        fields = ('id', 'item', 'description', 'created_by', 'starting_price', 'duration', 'highest_bid')

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('id', 'message')
