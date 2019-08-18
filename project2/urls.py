from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import  TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('rest-auth/',include('rest_auth.urls')),
    path('api/', include('music.api.urls')),
    path('', include('django.contrib.auth.urls')),
    re_path('.*', TemplateView.as_view(template_name='index.html'))
]
