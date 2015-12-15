from django.shortcuts import render, render_to_response
from showReport.models import *
from rest_framework import viewsets
from showReport.serializers import *
from showReport.permissions import *
from django.contrib.auth.decorators import login_required

from django.http import HttpResponseRedirect
from django.template import RequestContext
from django.core.urlresolvers import reverse
from showReport.forms import UploadFileForm
import csv_validator
from django.contrib.auth.models import User
import csv

#redirects user to registeration page
def register(request):
    if request.method == 'GET':
        return render(request, 'register.html')
    serialized = UserSerializer
    return render(request, 'register.html')

@login_required #redirects anonymous user to login page
def charts(request):
    return render(request, 'bootstrap-responsive-admin-template/code/charts.html')

@login_required #redirects anonymous user to login page
def table(request):
    return render(request, 'horizontal-admin/table.html')

@login_required #redirects anonymous user to login page
def settings(request):
    return render(request, 'horizontal-admin/settings.html')

@login_required #redirects anonymous user to login page
def inventory(request):
    asset_data=AssetRating.objects.all()
    return render(request, 'horizontal-admin/inventory.html', {"asset_data":asset_data.values()})
    
@login_required #redirects anonymous user to login page
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
                # Pull data from the uploaded file
                pullCSVData(request.FILES['csvFile'])
    else:
        form = UploadFileForm() # An empty form

    # Render list page with the documents and the form
    # Return to table page
    return render_to_response(
        'horizontal-admin/table.html',
        {'form': form,'validateResult': validateResult, 'validationMessage': validationMessage},
        context_instance=RequestContext(request)
    )  

"""
API endpoints
"""
"""
Used to GET POST PUT or DELETE rows in report table using REST API
"""
class ReportViewSet(viewsets.ModelViewSet):
    queryset = ReportTable.objects.all()
    serializer_class = ReportSerializer
    permission_classes = (IsAdminOrReadOnly,)

"""
Used to GET POST PUT or DELETE rows in asset table using REST API
"""
class AssetViewSet(viewsets.ModelViewSet):
    lookup_field = 'ip'
    lookup_value_regex = '[0-9.]+'

    queryset = AssetRating.objects.all()
    serializer_class = AssetSerializer
    permission_classes = (IsAdminOrReadOnly,)

"""
Used to GET POST PUT or DELETE rows in user table using REST API
"""
class UserViewSet(viewsets.ModelViewSet):
    # permissin_classes = [
    #     permissions.AllowAny # Or anon users can't register
    # ]
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = (editUserDetails,)


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
            #Add new IP to asset table
            if AssetRating.objects.filter(ip=row[0]).exists() is False:
                AssetRating.objects.create(ip=row[0])
        unique_ips.add(row[0])

        insert_list.append(ReportTable(title=row[6], impact=row[17],cveId=row[13],severity=row[8],solution=row[18],threat=row[16], assetInfo=AssetRating.objects.get(ip=row[0])))

    #Populate new report table in database
    ReportTable.objects.bulk_create(insert_list)

    filePath.close()
    return


