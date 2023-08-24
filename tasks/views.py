from django.db.models import Count
from rest_framework.views import APIView
from comments.models import Comment
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics, permissions
from rest_framework.response import Response
from .models import Task, Category
from .serializers import TaskSerializer, TaskDetailSerializer
from drf_api.permissions import IsAssignedUserOrOwnerOrReadOnly

class TaskList(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Task.objects.all()
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
    ]
    filterset_fields = [
        'owner__username',
        'owner__profile',
        'assigned_to',
        'title',
        'description',
        'priority',
        'task_status',
    ]
    search_fields = [
        'owner__username',
        'title',
        'description',
        'priority',
        'task_status',
        'created_date',
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    - Get single task detail
    """

    serializer_class = TaskDetailSerializer
    permission_classes = [IsAssignedUserOrOwnerOrReadOnly]
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
