from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from ..models import ForumPost, ForumComment

User = get_user_model()

class ForumTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            is_active=True
        )
        self.post = ForumPost.objects.create(
            title='Test Post',
            content='Test Content',
            author=self.user
        )
        self.client.force_authenticate(user=self.user)

    def test_create_post(self):
        data = {
            'title': 'New Post',
            'content': 'New Content'
        }
        response = self.client.post(reverse('forumpost-list'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ForumPost.objects.count(), 2)

    def test_add_comment(self):
        url = reverse('forumpost-add-comment', kwargs={'pk': self.post.pk})
        data = {'content': 'Test Comment'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.post.comments.count(), 1)

    def test_list_posts_with_comments(self):
        comment = ForumComment.objects.create(
            post=self.post,
            author=self.user,
            content='Test Comment'
        )
        response = self.client.get(reverse('forumpost-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data[0]['comments']), 1)
