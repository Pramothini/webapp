from django.contrib.auth.models import User
from showReport.models import *
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')

class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetRating
        fields = ('ip', 'rating')


class ReportSerializer(serializers.ModelSerializer):
    assetInfo = AssetSerializer()
    class Meta:
        model = ReportTable
        fields = ('businessRisk', 'title' , 'cveId','threat','impact','solution','severity','assetInfo')

