from django.shortcuts import render, render_to_response
from showReport.models import *
from rest_framework import viewsets
from showReport.serializers import *
from showReport.permissions import IsAdminOrReadOnly

from django.http import HttpResponseRedirect
from django.template import RequestContext
from django.core.urlresolvers import reverse
from showReport.forms import UploadFileForm
import csv_validator


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
    validationMessage = ""
    # Handle file upload
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            # Validate the uploaded file
            validateResult, validationMessage = csv_validator.validateCSV(request.FILES['csvFile'])
            if not validateResult:
                # Save the uploaded file
                newCSV = CSVDocument(csvfile = request.FILES['csvFile'])
                newCSV.save()
                print newCSV.csvfile.name
                # Redirect to the document list after POST
                return HttpResponseRedirect(reverse('csvInput'))
    else:
        form = UploadFileForm() # An empty form

    # Load documents for the list page
    allCSVFiles = CSVDocument.objects.all()

    # Render list page with the documents and the form
    return render_to_response(
        'csvInput.html',
        {'allCSVFiles': allCSVFiles, 'form': form, 'validationMessage': validationMessage},
        context_instance=RequestContext(request)
    )  

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

