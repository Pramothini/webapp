# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('showReport', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assetrating',
            name='ip',
            field=models.GenericIPAddressField(unique=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='assetrating',
            name='rating',
            field=models.IntegerField(default=b'5', validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)]),
            preserve_default=True,
        ),
    ]
