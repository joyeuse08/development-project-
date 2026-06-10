
import pytest
from ILES.models import CustomUser, Internship_Placement, Weekly_Log

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

placement = Internship_Placement.objects.create(
    student=user,
    company_name="Test Company",
    position="Intern"
)

log = Weekly_Log.objects.create(
    placement=placement,
    week_number=1,
    activities="Worked on React",
    challenges="None"
)
    assert log.status == "draft"


@pytest.mark.django_db
def test_week_number():
    user = CustomUser.objects.create_user(
        username="joy"
    )

placement = Internship_Placement.objects.create(
    student=user,
    company_name="Test Company",
    position="Intern"
)

log = Weekly_Log.objects.create(
    placement=placement,
    week_number=1,
    activities="Testing",
    challenges="None"
)

assert log.week_number == 1
