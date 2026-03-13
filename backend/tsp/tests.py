from rest_framework.test import APITestCase


class CityDatasetApiTests(APITestCase):
    def test_create_and_list_dataset(self):
        payload = {
            "name": "Indian Metro Sample",
            "description": "Four large city coordinates for demo visualizations.",
            "cities": [
                {"name": "Delhi", "lat": 28.6139, "lng": 77.209},
                {"name": "Mumbai", "lat": 19.076, "lng": 72.8777},
                {"name": "Jaipur", "lat": 26.9124, "lng": 75.7873},
                {"name": "Ahmedabad", "lat": 23.0225, "lng": 72.5714},
            ],
            "metadata": {"source": "test-suite"},
        }

        create_response = self.client.post("/api/cities/", payload, format="json")
        self.assertEqual(create_response.status_code, 201)
        self.assertEqual(create_response.data["name"], payload["name"])

        list_response = self.client.get("/api/cities/")
        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(len(list_response.data), 1)
