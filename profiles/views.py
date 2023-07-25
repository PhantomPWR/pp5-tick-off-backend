from django.http import Http404
from django.db.models import Count
from rest_framework import status, permissions, filters, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Profile
from watchers.models import Watcher
from .serializers import ProfileSerializer
from drf_api.permissions import IsOwnerOrReadOnly
from django.contrib.auth.models import User


class ProfileList(generics.ListAPIView):
    """
    List all profiles
    No Create view (post method), as profile creation handled by django signals
    """
    # queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    queryset = Profile.objects.annotate(
        task_count=Count('owner__task', distinct=True),
        watching_count=Count('owner__user_watching', distinct=True)
    ).order_by('-created_at')
    filter_backends = [
        filters.OrderingFilter
    ]
    ordering_fields = [
        'task_count',
        'watching_count',
        'owner__user_watching__created_at'
    ]


class ProfileDetail(generics.RetrieveUpdateAPIView):

    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = ProfileSerializer
    queryset = Profile.objects.annotate(
        task_count=Count('owner__task', distinct=True),
        watching_count=Count('owner__user_watching', distinct=True)
    ).order_by('-created_at')


class UserList(APIView):
    """
    List all users
    """
    def get(self, request):
        users = User.objects.all().values()
        return Response(users)
