from music.models import Album, Song, ShoppingItem, OrderHistory
from music.api.serializers import MusicSerializer, UserSerializer, SongSerializer, PasswordSerializer, ShoppingItemsSerializer, OrderHistorySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework.decorators import authentication_classes, permission_classes
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from django.forms.models import model_to_dict
from django.conf import settings
import stripe

class AlbumList(APIView):
    def get(self, request, format=None):
        username = request.GET.get('author')
        data_length = request.GET.get('data_length')

        #filter by author
        if username==None:
            albums = Album.objects.all()
        else:
            author_id = get_object_or_404(User, username=username).pk
            albums = Album.objects.filter(author=author_id).order_by('-date_posted')

        #filter by data length
        if data_length!=None:
            try:
                int(data_length)
            except ValueError:
                return Response('data length is invvalid', status=status.HTTP_406_NOT_ACCEPTABLE)
            else:
                albums = albums[:int(data_length)]

        serializer = MusicSerializer(albums, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = MusicSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AlbumDetail(APIView):

    def get_object(self, pk):
        try:
            return Album.objects.get(pk=pk)
        except Album.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        album = self.get_object(pk)
        serializer = MusicSerializer(album)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        album = self.get_object(pk)

        #only owner can edit
        if album.author != request.user:
            return Response({"detail": "You do not have permission to perform this action."},
                            status= status.HTTP_403_FORBIDDEN)

        serializer = MusicSerializer(album, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        album = self.get_object(pk)

        # only owner can delete
        if album.author != request.user:
            return Response({"detail": "You do not have permission to perform this action."},
                            status=status.HTTP_403_FORBIDDEN)

        album.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserList(APIView):
    def get(self, request, format=None):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

@authentication_classes([])
@permission_classes([])
class UserRegister(APIView):
    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():

            #email has to be unique
            email = request.POST.get('email')
            unique_email = User.objects.filter(email=email).count()
            if(unique_email > 0):
                return Response({'email': 'email already exist'}, status=status.HTTP_406_NOT_ACCEPTABLE)

            #validate password
            password = request.POST.get('password')
            try:
                validate_password(password)
            except exceptions.ValidationError as e:
                return Response(e.messages, status=status.HTTP_406_NOT_ACCEPTABLE)
            else:
                pass
            #register new user
            serializer.save()
            #set password for new user
            username = serializer.data.get('username')
            newUser = User.objects.get(username=username)
            newUser.set_password(password)
            #save password for new user
            newUser.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SongList(APIView):
    def get(self, request, format=None):
        songs = Song.objects.all()
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)

class UpdatePassword(APIView):
    def get_object(self, queryset=None):
        return self.request.user

    def put(self, request, *args, **kwargs):
        currentUser = self.get_object()
        serializer = PasswordSerializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            old_password = serializer.data.get("old_password")
            if not currentUser.check_password(old_password):
                return Response({"old_password": ["Wrong password."]},
                                status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            currentUser.set_password(serializer.data.get("new_password"))
            currentUser.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ShoppingItemsList(APIView):
    def get(self, request, format=None):
        #for privacy, only return shoppers items
        shoppingItems = ShoppingItem.objects.filter(shopper=request.user)
        serializer = ShoppingItemsSerializer(shoppingItems, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        #customer has item in cart
        try:
            revisitedItem = ShoppingItem.objects.get(shopper=request.user,  album=request.data.get('album'))
            revisitedItem.quantity= int(request.data.get('quantity')) + revisitedItem.quantity

            serializer = ShoppingItemsSerializer(data=model_to_dict( revisitedItem ))
            if serializer.is_valid():
                # update database
                revisitedItem.save()
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        #customer select new item
        except exceptions.ObjectDoesNotExist:
            serializer = ShoppingItemsSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ShoppingItemDetail(APIView):

    def get_object(self, pk):
        try:
            return ShoppingItem.objects.get(pk=pk)
        except ShoppingItem.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        shoppingItem = self.get_object(pk)
        serializer = ShoppingItemsSerializer(shoppingItem)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        shoppintItem = self.get_object(pk)

        #only owner can edit
        if shoppintItem.shopper != request.user:
            return Response({"detail": "You do not have permission to perform this action."},
                            status= status.HTTP_403_FORBIDDEN)

        serializer = ShoppingItemsSerializer(shoppintItem, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        shoppingItem = self.get_object(pk)

        # only owner can delete
        if shoppingItem.shopper != request.user:
            return Response({"detail": "You do not have permission to perform this action."},
                            status=status.HTTP_403_FORBIDDEN)

        shoppingItem.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CartCheckout(APIView):
    def post(self, request, format=None):
        stripe.api_key = settings.STRIPE_SECRET_KEY
        token = request.data.get('token')
        cart = request.data.get('cart')

        try:
            customer=stripe.Customer.create(email=token['email'],source=token['id'])
            charge=stripe.Charge.create(
                amount=int(cart['price']*100),
                currency='cad',
                receipt_email= token['email'],
                customer=customer.id,
                metadata=cart['items'],
            )
            return Response(charge, status=status.HTTP_202_ACCEPTED)
        except Exception as e:
            return Response(e, status=status.HTTP_400_BAD_REQUEST)

class OrderHistoryList(APIView):
    def get(self, request, format=None):
        orders = OrderHistory.objects.filter(shopper=request.user)
        serializer = OrderHistorySerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = OrderHistorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrderHistoryDetail(APIView):
    def get_object(self, pk):
        try:
            return OrderHistory.objects.get(pk=pk)
        except OrderHistory.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        stripe.api_key = settings.STRIPE_SECRET_KEY
        order = self.get_object(pk)
        try:
            #order is a model boject, request is a python dictionary
            charge=stripe.Charge.retrieve(order.order)
            return Response(charge, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(e, status=status.HTTP_400_BAD_REQUEST)