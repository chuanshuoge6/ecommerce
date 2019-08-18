from rest_framework import serializers
from music.models import Album, Song, ShoppingItem, OrderHistory
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class MusicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(MusicSerializer, self).__init__(*args, **kwargs)
        self.fields['album_logo'] = serializers.CharField(required=True)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ('id', 'album', 'file_type', 'song_title', 'is_favorite')

class PasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value

class ShoppingItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingItem
        fields = ('id', 'shopper', 'album', 'quantity')

class OrderHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderHistory
        fields = ('id', 'order', 'shopper', 'total', 'date')