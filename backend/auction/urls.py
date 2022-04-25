from django.urls import path
from rest_framework_simplejwt import views as jwt_views

from .views import get_user, CreateUser, BlacklistRefreshToken, CreateAuction, AuctionListView, AuctionDetailsView, MakeBid, MessageView

urlpatterns = [
    path('get_user/', get_user),
    path('create/user/', CreateUser.as_view(), name='create_user'),
    path('token/obtain/', jwt_views.TokenObtainPairView.as_view(), name='token_create'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('token/blacklist/', jwt_views.TokenBlacklistView.as_view(), name='token_blacklist'),
    path('create/auction/', CreateAuction.as_view(), name='create_auction'),
    path('search/auction/', AuctionListView.as_view(), name='search_auction'),
    path('get_auction/', AuctionDetailsView.as_view(), name='get_auction'),
    path('create/bid/', MakeBid.as_view(), name="make_bid"),
    path('get_messages/', MessageView.as_view(), name="get_messages"),
]
