from django.urls import re_path

from .consumers import VisualizationConsumer


websocket_urlpatterns = [
    re_path(
        r"ws/visualization/(?P<session_id>[a-zA-Z0-9_-]+)/$",
        VisualizationConsumer.as_asgi(),
    ),
]
