from showReport.models import *
from rest_framework import serializers


class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetRating
        fields = ('ip', 'rating')


class ReportSerializer(serializers.ModelSerializer):
    assetInfo = AssetSerializer()
    class Meta:
        model = ReportTable
        fields = ('businessRisk', 'title' , 'cveId','threat','impact','solution','severity','assetInfo')

