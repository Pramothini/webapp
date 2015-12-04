from showReport.models import *
from rest_framework import serializers
from django.contrib.auth.models import User
from django.shortcuts import render

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name','is_staff','is_active')
        write_only_fields = ('password',)
        read_only_fields = ('id',)

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

        user.set_password(validated_data['password'])
        user.is_active = False
        user.save()
        return user

class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetRating
        fields = ('ip', 'rating')


class ReportSerializer(serializers.ModelSerializer):
    assetInfo = AssetSerializer()
    class Meta:
        model = ReportTable
        fields = ('title' , 'cveId','threat','impact','solution','severity','assetInfo')

