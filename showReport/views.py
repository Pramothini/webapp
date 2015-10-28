from django.shortcuts import render
from .models import AssetRating
import csv
import os
# Create your views here.
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