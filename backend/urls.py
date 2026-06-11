
from django.contrib import admin
from django.urls import path,include 
from django.urls import re_path
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import redirect
from ILES.views import dashboard_view
from django.views.generic import TemplateView


urlpatterns = [
    path('', lambda request: redirect('/api/login/')),
    path('admin/', admin.site.urls),
    path('api/', include('ILES.urls')),
    path('dashboard/', dashboard_view, name='dashboard'), 
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

urlpatterns += [
    re_path(r'^(?!api/|admin/).*$', TemplateView.as_view(template_name='index.html'), name='react-app'),
]
