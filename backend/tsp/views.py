from rest_framework import generics

from .models import CityDataset
from .serializers import CityDatasetSerializer


class CityDatasetListCreateView(generics.ListCreateAPIView):
    queryset = CityDataset.objects.all()
    serializer_class = CityDatasetSerializer
