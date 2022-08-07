from django.shortcuts import render
from rest_framework import status, permissions, generics, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Auction, Message
from .serializers import UserSerializer, UserCreateSerializer, AuctionSerializer, AuctionDetailsSerializer, BidSerializer, MessageSerializer

# Create your views here.


# A simple view to retrieve user info
@api_view(['GET'])
def get_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

# Creates a new user account
class CreateUser(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        serializer = UserCreateSerializer(data = request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Blacklists JWTs for logging out
class BlacklistRefreshToken(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        refresh_token = request.data["refresh_token"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response(status=status.HTTP_205_RESET_CONTENT)


# Creates a new auction
class CreateAuction(APIView):
    parser_classes = (MultiPartParser, FormParser)

    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, *args, **kwargs):
        serializer = AuctionSerializer(data = request.data)
        if serializer.is_valid():
            auction = serializer.save()
            if auction:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Filters the list of all auctions based on the search parameters
class AuctionListView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    queryset = Auction.objects.all()
    serializer_class = AuctionDetailsSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['item', 'description']


# Retrieves details of an auction
class AuctionDetailsView(APIView):
     permission_classes = (permissions.AllowAny,)
     authentication_classes = ()

     def get(self, request, format='json'):
        auctionID = request.query_params.get("id")
        serializer = AuctionDetailsSerializer(Auction.objects.get(id=auctionID))
        return Response(serializer.data, status=status.HTTP_200_OK)


# Creates a new bid on an auction
class MakeBid(APIView):

    def post(self, request, format='json'):
        serializer = BidSerializer(data = request.data)
        if serializer.is_valid():
            bid = serializer.save(bidder = request.user)
            auction = bid.auction
            auction.highest_bid = bid
            auction.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Retrieves all messages for a given user
class MessageView(APIView):

    def get(self, request, format='json'):
        serializer = MessageSerializer(Message.objects.filter(receiver=request.user), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
