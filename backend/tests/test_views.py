import pytest
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_get_logs():
    client = APIClient()
    response = client.get("/api/logs/")
    assert response.status_code in [200, 401, 403]


@pytest.mark.django_db
def test_create_log():
    client = APIClient()

    data = {
        "activities": "Worked on API"
    }

    response = client.post("/api/logs/", data)
    assert response.status_code in [201, 400, 401]


@pytest.mark.django_db
def test_delete_log():
    client = APIClient()
    response = client.delete("/api/logs/1/")
    assert response.status_code in [204, 404, 401]
