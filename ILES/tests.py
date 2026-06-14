from django.test import TestCase
from rest_framework import test
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from ILES.models import Internship_Placement
from datetime import date
from ILES.models import Weekly_Log

User = get_user_model()

class AuthTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username= 'testuser',
            email= 'test@example.com',
            password = 'testpass123',
            role = 'extra_fields'
        )

    def test_login_returns_token(self):
        response = self.client.post('/api/login/',{
            'username':'testuser',
            'password':'testpass123',
        })    
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_unauthenticated_access_denied(self):
        response = self.client.get('/api/Internship_Placement/')
        self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)

class WeeklyLogTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.student = User.objects.create_user(
            username= 'student1',
            email= 'student1@example.com',
            password = 'testpass123',
            role = 'student'
        )
        self.placement = Internship_Placement.objects.create(
            student=self.student,
            company_name='Test Company',
            start_date=date(2025, 1, 1),
            end_date=date(2025, 6, 30),
            status='active'
        )
        
        self.client.force_authenticate(user=self.student)

    def test_student_can_create_weekly_log(self):
        response = self.client.post('/api/Weekly_Log/', {
            'week_number': 1,
            'activities': 'Worked on Django models',
            'challenges': 'Migration errors',
            'learnings': 'Fix and continue'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

class LogoutTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username= 'testuser',
            email= 'test@example.com',
            password = 'testpass123',
            role = 'student'
        )
        self.client.force_authenticate(user=self.user)


    def test_logout_works(self):
        response = self.client.post('/api/logout/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class RegistrationTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

    def test_registration_creates_user(self):
        response = self.client.post('/api/register/', {
            'username': 'newstudent',
            'email': 'newstudent@example.com',
            'password': 'newpass123',
            'role': 'student'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_duplicate_username_fails(self):
        User.objects.create_user(
            username= 'existinguser',
            email= 'existinguser@example.com',
            password = 'testpass123',
            role = 'student'
        )
        response = self.client.post('/api/register/', {
            'username': 'existinguser',
            'email': 'newstudent@example.com',
            'password': 'newpass123',
            'role': 'student'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class InternshipPlacementTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.student = User.objects.create_user(
            username='student2',
            email='student2@example.com',
            password='testpass123',
            role='student'
        )
        self.client.force_authenticate(user=self.student)

    def test_student_can_create_placement(self):
        response = self.client.post('/api/Internship_Placement/', {
            'student': self.student.id,
            'company_name': 'Google',
            'start_date': '2025-01-01',
            'end_date': '2025-06-30',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

class IssueTests(APITestCase):
    def setUp(self):
      self.client = APIClient()
      self.user = User.objects.create_user(
          username='issueuser',
          email='issueuser@example.com',
          password='testpass123',
          role='student'
      )
      self.placement = Internship_Placement.objects.create(
          student=self.user,
          company_name='Test Company',
          start_date=date(2025, 1, 1),
          end_date=date(2025, 6, 30),
          status='active'
      )
      self.client.force_authenticate(user=self.user)

    def test_create_issue(self):
      response = self.client.post('/api/issues/', {
        'title': 'Test Issue',
        'issue_type': 'Bug',
        'status': 'open',
        'placement': self.placement.id,
        'created_by': self.user.id,
      })
      self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class SupervisorFeedbackTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.supervisor = User.objects.create_user(
            username='supervisor1',
            email='supervisor1@example.com',
            password='testpass123',
            role='workplace'
        )
        self.student = User.objects.create_user(
            username='student3',
            email='student3@example.com',
            password='testpass123',
            role='student'
        )
        self.placement = Internship_Placement.objects.create(
            student=self.student,
            company_name='Test Company',
            start_date=date(2025, 1, 1),
            end_date=date(2025, 6, 30),
            status='active'
        )
        self.weekly_log = Weekly_Log.objects.create(
        placement=self.placement,
        week_number=1,
        activities='Test activities',
        status='submitted'
        )
        self.client.force_authenticate(user=self.supervisor)

    def test_supervisor_can_give_feedback(self):
        response = self.client.post('/api/Supervisor_Feedback/', {
            'placement': self.placement.id,
            'weekly_log': self.weekly_log.id,
            'supervisor': self.supervisor.id,
            'comments': 'Good work!',
            'supervisor_score': 85,
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)



    