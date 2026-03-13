from django.urls import path

from .views import AlgorithmCatalogView, SolveAPIView


urlpatterns = [
    path("algorithms/", AlgorithmCatalogView.as_view(), name="algorithm-catalog"),
    path("solve/", SolveAPIView.as_view(), name="solve-tsp"),
]
