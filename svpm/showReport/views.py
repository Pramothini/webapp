from django.shortcuts import render, render_to_response
from showReport.models import *
from rest_framework import viewsets
from showReport.serializers import *
from showReport.permissions import IsAdminOrReadOnly
from django.contrib.auth.decorators import login_required

from django.http import HttpResponseRedirect
from django.template import RequestContext
from django.core.urlresolvers import reverse
from showReport.forms import UploadFileForm
import csv_validator
from django.contrib.auth.models import User
import csv
import os


# Create your views here.
def register(request):
    if request.method == 'GET':
        return render(request, 'register.html')
    serialized = UserSerializer
    return render(request, 'register.html')


@login_required
def charts(request):
    return render(request, 'bootstrap-responsive-admin-template/code/charts.html')

@login_required
def table(request):
    return render(request, 'horizontal-admin/table.html')

@login_required
def settings(request):
    return render(request, 'horizontal-admin/settings.html')

@login_required
def inventory(request):
    return render(request, 'horizontal-admin/inventory.html')

@login_required
def menu(request):
    return render(request, 'menu.html')

@login_required
def home(request):
    return render(request, 'home.html')

@login_required
def report(request):
    return render(request, 'report.html')

@login_required
def assets(request):
    asset_data=AssetRating.objects.all()
    return render(request, 'assets.html', {"asset_data":asset_data.values()})

@login_required
def csvInput(request):
    validationMessage = ""
    validateResult = 0
    # Handle file upload
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            # Validate the uploaded file
            validateResult, validationMessage = csv_validator.validateCSV(request.FILES['csvFile'])
            if not validateResult:
                # Save the uploaded file
                #newCSV = CSVDocument(csvfile = request.FILES['csvFile'])
                #newCSV.save()
                #print newCSV.csvfile.name
                pullCSVData(request.FILES['csvFile'])

                # Redirect to the document list after POST
                # return HttpResponseRedirect(reverse('csvInput'))
    else:
        form = UploadFileForm() # An empty form

    print validateResult
    # Load documents for the list page
    allCSVFiles = CSVDocument.objects.all()

    # Render list page with the documents and the form
    return render_to_response(
        'horizontal-admin/table.html',
        {'allCSVFiles': allCSVFiles, 'form': form,'validateResult': validateResult, 'validationMessage': validationMessage},
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
    lookup_field = 'ip'
    lookup_value_regex = '[0-9.]+'

    queryset = AssetRating.objects.all()
    serializer_class = AssetSerializer
    permission_classes = (IsAdminOrReadOnly,)

class UserViewSet(viewsets.ModelViewSet):
    # permissin_classes = [
    #     permissions.AllowAny # Or anon users can't register
    # ]
    serializer_class = UserSerializer
    queryset = User.objects.all()


def pullCSVData(filePath):
    insert_list = []
    unique_ips = set()
    # f = open(os.path.join(settings.MEDIA_ROOT, filePath))
    reader = csv.reader(filePath)
    for row in reader:
        if row[0] == 'IP':
            #Header row found (Assuming a good csv file)
            break

    ReportTable.objects.all().delete()

    #Populate data from here
    for row in reader:
        if row[0] not in unique_ips:
            if AssetRating.objects.filter(ip=row[0]).exists() is False:
                AssetRating.objects.create(ip=row[0])
        unique_ips.add(row[0])

        insert_list.append(ReportTable(title=row[6], impact=row[17],cveId=row[13],severity=row[8],solution=row[18],threat=row[16], assetInfo=AssetRating.objects.get(ip=row[0])))

    ReportTable.objects.bulk_create(insert_list)

    filePath.close()
    return


