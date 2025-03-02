from django.http import Http404, JsonResponse
from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters
from rest_framework.views import APIView
from rest_framework.response import Response
from comments.models import Comment
from rest_framework import (
    filters as drf_filters,
    generics,
    permissions,
    status,
)
from .models import Task, Category
from .serializers import (
    TaskSerializer,
    TaskDetailSerializer
)
from drf_api.permissions import IsOwnerOrReadOnly


class TaskFilter(filters.FilterSet):
    created_date__month = filters.NumberFilter(
        field_name='created_date',
        lookup_expr='month'
    )
    due_date__month = filters.NumberFilter(
        field_name='due_date',
        lookup_expr='month'
    )


class TaskList(generics.ListCreateAPIView):
    """
    - List all tasks
    - Create task if logged in
    """

    serializer_class = TaskSerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

    queryset = Task.objects.annotate(
        comment_count=Count('comment', distinct=True),
    ).order_by('-created_date')

    filter_backends = [
        drf_filters.OrderingFilter,
        drf_filters.SearchFilter,
        filters.DjangoFilterBackend
    ]

    ordering_fields = [
        'comment_count',
    ]
    filterset_fields = [
        'owner__username',
        'owner__profile__name',
        'assigned_to__username',
        'title',
        'description',
        'priority',
        'task_status',
    ]
    search_fields = [
        'owner__username',
        'owner__profile__name',
        'assigned_to__username',
        'title',
        'description',
        'priority',
        'task_status',
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    - Get single task detail
    """

    serializer_class = TaskDetailSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Task.objects.annotate(
        comment_count=Count('comment', distinct=True),
    ).order_by('-created_date')


class StatusChoicesView(APIView):
    """
    - Get available task status choices
    """

    def get(self, request):
        status_choices = []
        for choice in Task.STATUS_CHOICES:
            status_choices.append({'value': choice[0], 'label': choice[1]})
        return Response(status_choices)


class PriorityChoicesView(APIView):
    """
    - Get available task priority choices
    """

    def get(self, request):
        priority_choices = []
        for choice in Task.PRIORITY_CHOICES:
            priority_choices.append({'value': choice[0], 'label': choice[1]})
        return Response(priority_choices)


class CategoryChoicesView(APIView):
    """
    - Get available category choices
    """

    def get(self, request):
        categories = Category.objects.all()
        category_choices = []
        for category in categories:
            category_choices.append({'value': category.id, 'label': category.title})
        return Response(category_choices)
