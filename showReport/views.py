from django.shortcuts import render
from .models import AssetRating
# Create your views here.
def mainMenu(request):
    context=AssetRating.objects.all()
    return render(request, 'mainMenu.html', {"context":context.values()})

def getAssets(request):
    context=AssetRating.objects.all()
    return render(request, 'assetData.html', {"context":context.values()})

