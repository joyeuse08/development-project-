import pytest
from ILES.serializers import Student_logSerializer

@pytest.mark.django_db
def test_student_log_serializer_valid_data():
    data = {
        "date": "2026-06-08",
        "description": "Worked on API integration",
        "hours": 4,
        "challenges": "None"
    }
    serializer = Student_logSerializer(data=data)
    assert serializer.is_valid(), serializer.errors

@pytest.mark.django_db
def test_student_log_serializer_invalid_hours():
    data = {
        "date": "2026-06-08",
        "description": "Worked on API integration",
        "hours": 0,
        "challenges": "None"
    }
    serializer = Student_logSerializer(data=data)
    assert not serializer.is_valid()
    assert "hours" in serializer.errorsimport pytest

def test_valid_score():
    score = 80
    assert score <= 100


def test_invalid_score():
    score = 120
    assert score > 100


def test_negative_score():
    score = -5
    assert score < 0
