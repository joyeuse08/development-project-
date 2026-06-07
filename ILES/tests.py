from django.test import TestCase
from rest_framework import test
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

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





# Create your tests here.
