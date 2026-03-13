from rest_framework.test import APITestCase


class SolveApiTests(APITestCase):
    def setUp(self):
        self.cities = [
            {"name": "Delhi", "lat": 28.6139, "lng": 77.209},
            {"name": "Mumbai", "lat": 19.076, "lng": 72.8777},
            {"name": "Jaipur", "lat": 26.9124, "lng": 75.7873},
            {"name": "Ahmedabad", "lat": 23.0225, "lng": 72.5714},
        ]

    def test_solve_endpoint_returns_required_fields(self):
        payload = {
            "algorithm": "genetic",
            "cities": self.cities,
            "parameters": {
                "population": 20,
                "generations": 20,
                "seed": 7,
            },
        }

        response = self.client.post("/api/solve/", payload, format="json")
        self.assertEqual(response.status_code, 200)

        data = response.data
        self.assertIn("route", data)
        self.assertIn("distance", data)
        self.assertIn("time_ms", data)
        self.assertIn("history", data)
        self.assertEqual(data["route"][0], data["route"][-1])

    def test_bruteforce_rejects_large_input(self):
        payload = {
            "algorithm": "brute_force",
            "cities": self.cities * 3,
            "parameters": {"max_cities": 5},
        }

        response = self.client.post("/api/solve/", payload, format="json")
        self.assertEqual(response.status_code, 400)
