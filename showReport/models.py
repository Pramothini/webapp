from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

class AssetManager(models.Manager):
    def get_by_natural_key(self, ip, rating):
        return self.get(ip=ip, rating=rating)

# Create your models here.
class AssetRating(models.Model):
    ip = models.GenericIPAddressField(unique=True)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)],default='5')
    objects = AssetManager()
		
class ReportTable(models.Model):
    businessRisk = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    title = models.TextField()
    cveId = models.CharField(max_length=100)
    threat = models.TextField()
    impact = models.TextField()
    solution = models.TextField()
    severity = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    assetInfo = models.ForeignKey(AssetRating)


