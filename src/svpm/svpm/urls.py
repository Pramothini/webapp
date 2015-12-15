"""svpm URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url, patterns
from django.contrib import admin
from showReport import views
from rest_framework import routers
from django.conf.urls.static import static
from django.conf import settings

router = routers.DefaultRouter()
router.register(r'reportAPI', views.ReportViewSet)
router.register(r'assetAPI', views.AssetViewSet)
router.register(r'userAPI', views.UserViewSet)
urlpatterns = router.urls

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^charts$', 'showReport.views.charts', name='charts'),
    url(r'^settings$', 'showReport.views.settings', name='settings'),
    url(r'^table$', 'showReport.views.table', name='table'),
    url(r'^inventory$', 'showReport.views.inventory', name='inventory'),
    url(r'^csvinput$', 'showReport.views.csvInput', name='csvInput'),
    url(r'^login$', 'django.contrib.auth.views.login', {'template_name':'login.html'}),
    url(r'^register$', 'showReport.views.register', name='register'),
    url(r'^logout$', 'django.contrib.auth.views.logout_then_login'),
    url(r'^$', 'django.contrib.auth.views.login', {'template_name':'login.html'}),
    url(r'^', include(router.urls))

) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
