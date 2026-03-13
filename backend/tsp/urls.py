from django.urls import path

from .views import CityDatasetListCreateView


urlpatterns = [
    path("", CityDatasetListCreateView.as_view(), name="city-dataset-list-create"),
]
