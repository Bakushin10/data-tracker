from django.db import models

class FavoriteCommand(models.Model):
    name = models.CharField(max_length=255, blank=False)
    company = models.TextField(blank=False)
    sql = models.TextField(blank=False)
    previous_period = models.IntegerField(blank=False)

    class Meta:
        pass