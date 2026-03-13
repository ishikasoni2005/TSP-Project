from django.db import models


class CityDataset(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    cities = models.JSONField(default=list)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at", "-created_at"]

    def __str__(self):
        return self.name
