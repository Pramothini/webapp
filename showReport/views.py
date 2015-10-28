from django.shortcuts import render
from showReport.models import *
from rest_framework import viewsets
from showReport.serializers import *
import csv
import os
# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

class ReportViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows reports to be viewed or edited.
    """
    queryset = ReportTable.objects.all()
    serializer_class = ReportSerializer

def mainMenu(request):
    context=AssetRating.objects.all()
    return render(request, 'mainMenu.html', {"context":context.values()})

def getAssets(request):
    context=AssetRating.objects.all()
    return render(request, 'assetData.html', {"context":context.values()})

def home(request):
    # workpath = os.path.dirname(os.path.abspath(__file__)) #Returns the Path your .py file is in
    # resultlist = []
    # with open(workpath+'/static/webapp_input.csv', 'rt') as f:
    #     reader = csv.DictReader(f)
    #     for row in reader:
    #         resultlist.append(row)
    context=AssetRating.objects.all()
    print context.values()
    return render(request, 'home.html',{"context":context.values()})