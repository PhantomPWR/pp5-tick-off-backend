from django.contrib.auth.models import User
from .models import Task
from rest_framework import status
from rest_framework.test import APITestCase


class TaskListViewTests(APITestCase):
    '''
        Tasklist View Tests
    '''

    def setUp(self):
        User.objects.create_user(username='rick', password='allen')

    def test_can_list_tasks(self):
        rick = User.objects.get(username='rick')
        Task.objects.create(owner=rick, title='a title')
        response = self.client.get('/tasks/')
        # self.assertEqual(response.status_code, status.HTTP_201_CREATED)  # Test Fail
        self.assertEqual(response.status_code, status.HTTP_200_OK)  # Test Pass
        print(response.data)
        print(len(response.data))

    def test_logged_in_user_can_create_task(self):
        self.client.login(username='rick', password='allen')
        response = self.client.post('/tasks/', {'title': 'a title'})
        count = Task.objects.count()
        self.assertEqual(count, 1)
        # self.assertEqual(response.status_code, status.HTTP_200_OK)  # Test Fail
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)  # Test Pass

    def test_user_not_logged_in_cant_create_task(self):
        response = self.client.post('/tasks/', {'title': 'a title'})
        # self.assertEqual(response.status_code, status.HTTP_200_OK)  # Test Fail
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)  # Test Pass


class TaskDetailViewTests(APITestCase):
    '''
        Task Detail View Test
    '''
    def setUp(self):
        rick = User.objects.create_user(username='rick', password='allen')
        joe = User.objects.create_user(username='joe', password='elliot')
        Task.objects.create(
            owner=rick, title='Rick\'s title', notes='Rick\'s notes'
        )
        Task.objects.create(
            owner=joe, title='Joe\'s title', notes='Joe\'s notes'
        )

    def test_can_retrieve_task_using_valid_id(self):
        response = self.client.get('/tasks/1/')
        self.assertEqual(response.data['title'], 'Rick\'s title')
        # self.assertEqual(response.status_code, status.HTTP_201_CREATED)  # Test Fail
        self.assertEqual(response.status_code, status.HTTP_200_OK)  # Test Pass

    def test_cant_retrieve_task_using_invalid_id(self):
        response = self.client.get('/tasks/999/')
        # self.assertEqual(response.status_code, status.HTTP_200_OK)  # Test Fail
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)  # Test Pass

    def test_user_can_update_own_task(self):
        self.client.login(username='rick', password='allen')
        response = self.client.put('/tasks/1/', {'title': 'a new title'})
        task = Task.objects.filter(pk=1).first()
        self.assertEqual(task.title, 'a new title')
        # self.assertEqual(response.status_code, status.HTTP_201_CREATED)  # Test Fail
        self.assertEqual(response.status_code, status.HTTP_200_OK)  # Test Pass

    def test_user_cant_update_another_users_task(self):
        self.client.login(username='rick', password='allen')
        response = self.client.put('/tasks/2/', {'title': 'a new title'})
        # self.assertEqual(response.status_code, status.HTTP_200_OK)  # Test Fail
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)  # Test Pass
