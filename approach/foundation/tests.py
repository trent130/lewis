# from django.test import TestCase
# from django.contrib.auth.models import User
# from .models import Chat

# # Create your tests here.
# class ChatModeTest(TestCase):
#     def setUp(self):
#         self.user = User.objects.create(
#             username = "username",
#             password = "password",
#         )
#         self.chat = Chat.objects.create(
#             user = self.user,
#             message = "test message",
#         )
#     def test_message_creation(self):
#         self.assertEqual(self.chat.message, "test message")
#         self.assertEqual(self.chat.user.username, 'username')
    
#     def message_str_test(self):
#         self.assertEqual(self.chat, 'test message')
# class UserModelTest(TestCase):
#     def setUp(self):
#         self.user = User.objects.create(
#             username='username', 
#             password='password'
#         )
    
#     def user_creation_test(self):
#         self.assertEqual(self.user.username, 'username')
#         self.assertEqual(self.user.password, 'password')
    
