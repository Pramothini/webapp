from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

"""
database table to store asset details
ip - IPV4 address of the asset
rating - asset importance selected by the system administrator
"""
class AssetRating(models.Model):
    ip = models.GenericIPAddressField(primary_key=True)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)],default='5')
               
"""
database table to store report details
"""               
class ReportTable(models.Model):
    title = models.TextField()
    cveId = models.CharField(max_length=1000)
    threat = models.TextField()
    impact = models.TextField()
    solution = models.TextField()
    severity = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    assetInfo = models.ForeignKey(AssetRating, db_column="assetInfo")
