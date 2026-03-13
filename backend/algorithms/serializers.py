from rest_framework import serializers

from .services import normalize_algorithm_name


class CityInputSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=80)
    lat = serializers.FloatField(min_value=-90, max_value=90)
    lng = serializers.FloatField(min_value=-180, max_value=180)


class SolveRequestSerializer(serializers.Serializer):
    algorithm = serializers.CharField()
    cities = CityInputSerializer(many=True)
    parameters = serializers.DictField(required=False, default=dict)
    session_id = serializers.RegexField(
        regex=r"^[a-zA-Z0-9_-]{6,64}$",
        required=False,
        allow_null=True,
    )

    def validate_algorithm(self, value):
        return normalize_algorithm_name(value)

    def validate_cities(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("At least two cities are required to solve TSP.")

        names = [city["name"].strip() for city in value]
        if len(names) != len(set(names)):
            raise serializers.ValidationError("City names must be unique.")

        return value
