
import pytest
from internship.models import CustomUser, WeeklyLog

@pytest.mark.django_db
def test_create_user():
    user = CustomUser.objects.create_user(
        username="joy",
        password="1234",
        role="student"
    )
    assert user.role == "student"


@pytest.mark.django_db
def test_create_log():
    user = CustomUser.objects.create_user(
        username="joy",
        password="1234"
    )

    log = WeeklyLog.objects.create(
        student=user,
        activities="Worked on React"
    )

    assert log.status == "draft"


@pytest.mark.django_db
def test_week_number():
    user = CustomUser.objects.create_user(
        username="joy"
    )

    log = WeeklyLog.objects.create(
        student=user,
        week=1,
        activities="Testing"
    )

    assert log.week == 1
