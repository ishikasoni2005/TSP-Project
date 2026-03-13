from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .utils import build_solver_group_name


class VisualizationBroadcaster:
    def __init__(self, session_id):
        self.session_id = session_id
        self.group_name = build_solver_group_name(session_id)
        self.channel_layer = get_channel_layer()

    def _send(self, event_type, payload):
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                "type": event_type,
                "payload": payload,
            },
        )

    def send_status(self, payload):
        self._send("solver_status", payload)

    def send_progress(self, payload):
        self._send("solver_progress", payload)

    def send_complete(self, payload):
        self._send("solver_complete", payload)

    def send_error(self, message):
        self._send("solver_error", {"message": message})
