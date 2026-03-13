from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .utils import build_solver_group_name


class VisualizationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.session_id = self.scope["url_route"]["kwargs"]["session_id"]
        self.group_name = build_solver_group_name(self.session_id)

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send_json(
            {
                "type": "connected",
                "data": {"session_id": self.session_id},
            }
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        if content.get("type") == "ping":
            await self.send_json({"type": "pong", "data": {"session_id": self.session_id}})

    async def solver_status(self, event):
        await self.send_json({"type": "status", "data": event["payload"]})

    async def solver_progress(self, event):
        await self.send_json({"type": "progress", "data": event["payload"]})

    async def solver_complete(self, event):
        await self.send_json({"type": "complete", "data": event["payload"]})

    async def solver_error(self, event):
        await self.send_json({"type": "error", "data": event["payload"]})
