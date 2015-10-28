from django.contrib.auth.models import User
from showReport.models import *
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class ReportSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ReportTable
        fields = ('businessRisk', 'title' , 'cveId','threat','impact','solution','severity')