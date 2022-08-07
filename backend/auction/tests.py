from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate
from datetime import timedelta, datetime, timezone

from .models import User, Auction, Message
from .views import CreateUser, CreateAuction, MakeBid, AuctionListView, MessageView
from rest_framework_simplejwt import views as jwt_views

# Create your tests here.

class UserTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

    def test_user_create_and_login(self):
        request = self.factory.post('/api/create/user/', {'username': 'test_user', 'email': 'testemail@email.com', 'password': 'testpassword'}, format='json')

        response = CreateUser.as_view()(request)
        self.assertEqual(response.status_code, 201)

        request = self.factory.post('/api/token/obtain/', {'username': 'test_user', 'password': 'testpassword'}, format='json')

        response = jwt_views.TokenObtainPairView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def test_wrong_login(self):
        request = self.factory.post('/api/token/obtain/', {'username': 'test_wrong_user', 'password': 'wrongpassword'}, format='json')

        response = jwt_views.TokenObtainPairView.as_view()(request)
        self.assertEqual(response.status_code, 401)


class BidTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(username='testuser', email='test@email.com', password='test_password')
        self.test_auction = Auction.objects.create(item="Headphones", description="Sony MDR-ZX110 Overhead Headphones", created_by=self.user, starting_price="15", duration=timedelta(days=1), pub_date=datetime.now(timezone.utc))

    def test_bid(self):
        request = self.factory.post('/api/create/bid/', {'auction': self.test_auction.id, 'bid': 30})
        force_authenticate(request, user=self.user)

        response = MakeBid.as_view()(request)
        self.assertEqual(response.status_code, 201)

    def test_unauthenticated_bid(self):
        request = self.factory.post('/api/create/bid/', {'auction': self.test_auction.id, 'bid': 30})

        response = MakeBid.as_view()(request)
        self.assertEqual(response.status_code, 401)

class AuctionSearchTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(username='testuser', email='test@email.com', password='test_password')
        self.test_auction = Auction.objects.create(item="Headphones", description="Sony MDR-ZX110 Overhead Headphones", created_by=self.user, starting_price="15", duration=timedelta(days=1), pub_date=datetime.now(timezone.utc))

    def test_auction_query(self):
        request = self.factory.get('/api/search/auction/?search=Headphones')

        response = AuctionListView.as_view()(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Auction.objects.count(), 1)

class MessageTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(username='testuser', email='test@email.com', password='test_password')
        self.test_message = Message.objects.create(receiver=self.user, message="test message")

    def test_message_query(self):
        request = self.factory.get('/api/get_messages/')
        force_authenticate(request, user=self.user)

        response = MessageView.as_view()(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Message.objects.count(), 1)
