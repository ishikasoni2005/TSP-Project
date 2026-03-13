from django.contrib import admin

from .models import CityDataset


@admin.register(CityDataset)
class CityDatasetAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at", "updated_at")
    search_fields = ("name", "description")
    readonly_fields = ("created_at", "updated_at")
