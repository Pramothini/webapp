# -*- coding: utf-8 -*-

from django import forms

class UploadFileForm(forms.Form):
    csvFile = forms.FileField(
        label='Select a .csv file',
        help_text='max. 50 MB'
    )