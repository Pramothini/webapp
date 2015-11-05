# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('showReport', '0002_auto_20151104_0609'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reporttable',
            name='cveId',
            field=models.CharField(max_length=100),
            preserve_default=True,
        ),
    ]
