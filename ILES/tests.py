from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from .models import CustomUser


class AuthAPITests(APITestCase):
    def test_register_creates_user_and_returns_token(self):
        response = self.client.post(
            reverse('register'),
            {
                'username': 'newstudent',
                'email': 'newstudent@example.com',
                'password': 'StrongPassword123!',
                'role': 'student',
                'department': 'Computer Science',
                'student_number': 'S001',
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['username'], 'newstudent')
        self.assertTrue(CustomUser.objects.filter(username='newstudent').exists())

    def test_login_returns_token_for_valid_credentials(self):
        username = 'existinguser'
        password = 'StrongPassword123!'
        CustomUser.objects.create_user(
            username=username,
            email='existing@example.com',
            password=password,
            role='student',
        )

        response = self.client.post(
            reverse('login'),
            {'username': username, 'password': password},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['username'], username)

    def test_login_requires_username_and_password(self):
        response = self.client.post(
            reverse('login'),
            {'username': '', 'password': ''},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Username and password are required')
