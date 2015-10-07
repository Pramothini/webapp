from django.shortcuts import render
import csv
import os

# Create your views here.
def home(request):
    workpath = os.path.dirname(os.path.abspath(__file__)) #Returns the Path your .py file is in
    resultlist = []
    with open(workpath+'/static/webapp_input.csv', 'rt') as f:
        reader = csv.DictReader(f)
        for row in reader:
            resultlist.append(row)
    return render(request, 'index.html',{'resultlist':resultlist})


def getTables(request):
    # Sets up list of just the logged-in user's (request.user's) items
    return render(request, 'tables.html')
