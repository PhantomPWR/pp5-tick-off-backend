from django.http import Http404
from django.db.models import Count
from rest_framework import status, permissions, filters, generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User

from .models import Profile
from .serializers import ProfileSerializer
from drf_api.permissions import IsOwnerOrReadOnly


class ProfileList(generics.ListAPIView):
    """
    - List all profiles
    - No Create view (post method),
      as profile creation handled by django signals
    """

    queryset = Profile.objects.annotate(
        task_count=Count(
            'owner__task',
            distinct=True
        ),
    ).order_by('-created_at')

    serializer_class = ProfileSerializer

    filter_backends = [
        filters.OrderingFilter,
        filters.SearchFilter,
        DjangoFilterBackend
    ]

    search_fields = [
        'owner__username',
    ]
    ordering_fields = [
        'task_count',
    ]


class ProfileDetail(generics.RetrieveUpdateAPIView):
    """
    - Profile details
    """

    permission_classes = [IsOwnerOrReadOnly]

    queryset = Profile.objects.annotate(
        task_count=Count(
            'owner__task',
            distinct=True
        ),
    ).order_by('-created_at')

    serializer_class = ProfileSerializer


class UserList(APIView):
    """
    - List all users
    """
    def get(self, request):
        users = User.objects.all().values()
        return Response(users)
