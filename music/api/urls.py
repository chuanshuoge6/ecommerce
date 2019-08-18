from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from music.api import apiview
from rest_framework.authtoken import views

app_name = 'musicAPI'

urlpatterns = [
    path('album_list/', apiview.AlbumList.as_view(), name='AlbumList'),
    path('shoppingItems/', apiview.ShoppingItemsList.as_view(), name='ShoppingItems'),
    path('user_list/', apiview.UserList.as_view(), name='UserList'),
    path('user_register/', apiview.UserRegister.as_view(), name='UserRegister'),
    path('song_list/', apiview.SongList.as_view(), name='SongList'),
    path('cart_checkout/', apiview.CartCheckout.as_view(), name='CartCheckout'),
    path('order_history/', apiview.OrderHistoryList.as_view(), name='OrderHistory'),
    path('album_detail/<int:pk>/', apiview.AlbumDetail.as_view(), name='AlbumDetail'),
    path('shoppingItem/<int:pk>/', apiview.ShoppingItemDetail.as_view(), name='ShoppingItemDetail'),
    path('orderDetail/<int:pk>/', apiview.OrderHistoryDetail.as_view(), name='OrderDetail'),
    path('api-token-auth/', views.obtain_auth_token, name='AuthToken'),
    path('update_password/', apiview.UpdatePassword.as_view(), name='UpdatePassword'),
]

urlpatterns = format_suffix_patterns(urlpatterns)