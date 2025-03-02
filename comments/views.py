from django.http import Http404, JsonResponse
from django.db.models import Count
from django.contrib.humanize.templatetags.humanize import naturaltime
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import serializers
from rest_framework import (
    filters,
    generics,
    permissions,
    status,
)
from .models import Task, Comment
from .serializers import CommentSerializer, CommentDetailSerializer
from drf_api.permissions import IsOwnerOrReadOnly


class CommentList(generics.ListCreateAPIView):
    """
    - List comments
    - Allow users to create comments
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Comment.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = [
        'task',
        'owner',
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    - Get comment detail
    - Comment owner can update or delete
    """
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = CommentDetailSerializer
    queryset = Comment.objects.all()
