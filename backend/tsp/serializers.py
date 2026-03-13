from rest_framework import serializers

from .models import CityDataset


class DatasetCitySerializer(serializers.Serializer):
    name = serializers.CharField(max_length=80)
    lat = serializers.FloatField()
    lng = serializers.FloatField()


class CityDatasetSerializer(serializers.ModelSerializer):
    cities = DatasetCitySerializer(many=True)
    metadata = serializers.JSONField(required=False)

    class Meta:
        model = CityDataset
        fields = [
            "id",
            "name",
            "description",
            "cities",
            "metadata",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_cities(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("A dataset must contain at least two cities.")

        names = [city["name"].strip() for city in value]
        if len(set(names)) != len(names):
            raise serializers.ValidationError("City names must be unique within a dataset.")

        return value
