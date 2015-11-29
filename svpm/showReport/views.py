from django.shortcuts import render
from showReport.models import *
from rest_framework import viewsets
from showReport.serializers import *
from showReport.permissions import IsAdminOrReadOnly

# Create your views here.
def menu(request):
    return render(request, 'menu.html')
def home(request):
    return render(request, 'home.html')
def report(request):
    return render(request, 'report.html')
def assets(request):
    asset_data=AssetRating.objects.all()
    return render(request, 'assets.html', {"asset_data":asset_data.values()})
def csvInput(request):
    return render(request, 'csvInput.html')

"""
API endpoints
"""
class ReportViewSet(viewsets.ModelViewSet):
    queryset = ReportTable.objects.all()
    serializer_class = ReportSerializer
    permission_classes = (IsAdminOrReadOnly,)

class AssetViewSet(viewsets.ModelViewSet):
    queryset = AssetRating.objects.all()
    serializer_class = AssetSerializer
    permission_classes = (IsAdminOrReadOnly,)

