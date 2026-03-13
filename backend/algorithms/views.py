from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from visualization.services import VisualizationBroadcaster

from .serializers import SolveRequestSerializer
from .services import get_algorithm_catalog, solve_algorithm


class AlgorithmCatalogView(APIView):
    def get(self, _request):
        return Response({"algorithms": get_algorithm_catalog()})


class SolveAPIView(APIView):
    def post(self, request):
        serializer = SolveRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        payload = serializer.validated_data
        session_id = payload.get("session_id")
        broadcaster = VisualizationBroadcaster(session_id) if session_id else None

        if broadcaster:
            broadcaster.send_status(
                {
                    "stage": "started",
                    "algorithm": payload["algorithm"],
                    "city_count": len(payload["cities"]),
                }
            )

        parameters = dict(payload.get("parameters") or {})
        if broadcaster:
            parameters["progress_callback"] = broadcaster.send_progress

        try:
            result = solve_algorithm(payload["algorithm"], payload["cities"], parameters)
        except ValueError as exc:
            if broadcaster:
                broadcaster.send_error(str(exc))
            raise ValidationError({"detail": str(exc)}) from exc

        result["algorithm"] = payload["algorithm"]

        if broadcaster:
            broadcaster.send_complete(result)

        return Response(result, status=status.HTTP_200_OK)
