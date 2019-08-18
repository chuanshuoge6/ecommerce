from django.contrib import admin
from .models import Album, Song, ShoppingItem, OrderHistory

admin.site.register(Album)

admin.site.register(Song)

admin.site.register(ShoppingItem)

admin.site.register(OrderHistory)