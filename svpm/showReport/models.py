from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.
class AssetRating(models.Model):
    ip = models.GenericIPAddressField(primary_key=True)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)],default='5')
                
class ReportTable(models.Model):
    title = models.TextField()
    cveId = models.CharField(max_length=100)
    threat = models.TextField()
    impact = models.TextField()
    solution = models.TextField()
    severity = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    assetInfo = models.ForeignKey(AssetRating, db_column="assetInfo")
