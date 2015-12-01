# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AssetRating',
            fields=[
                ('ip', models.GenericIPAddressField(serialize=False, primary_key=True)),
                ('rating', models.IntegerField(default=b'5', validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
            ],
        ),
        migrations.CreateModel(
            name='CSVDocument',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('csvfile', models.FileField(upload_to=b'%Y/%m/%d')),
            ],
        ),
        migrations.CreateModel(
            name='ReportTable',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('businessRisk', models.IntegerField(validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(10)])),
                ('title', models.TextField()),
                ('cveId', models.CharField(max_length=100)),
                ('threat', models.TextField()),
                ('impact', models.TextField()),
                ('solution', models.TextField()),
                ('severity', models.IntegerField(validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(10)])),
                ('assetInfo', models.ForeignKey(to='showReport.AssetRating', db_column=b'assetInfo')),
            ],
        ),
    ]
