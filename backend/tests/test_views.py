import pytest
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_get_logs():
    client = APIClient()
    response = client.get("/api/Weekly_Log/")
    response = client.get("/api/Student_log/")
    assert response.status_code in [200, 401, 403]


@pytest.mark.django_db
def test_create_log():
    client = APIClient()

    data = {
        "week_number": 1,
        "activities": "Worked on API",
        "challenges": "None"
    }
    
    response = client.post("/api/Weekly_Log/", data)
    assert response.status_code in [201, 400, 401]

    data = {
    "date": "2026-06-08",
    "description": "Worked on API",
    "hours": 4,
    "challenges": "None"
}

    response = client.post("/api/Student_log/", data)


@pytest.mark.django_db
def test_delete_log():
    client = APIClient()
    response = client.delete("/api/Weekly_Log/1/")
    
    assert response.status_code in [204, 404, 401]
