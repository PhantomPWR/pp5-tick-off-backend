from django.db.models import Count
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics, permissions
from rest_framework.response import Response
from .serializers import TaskSerializer, TaskDetailSerializer
from drf_api.permissions import IsAssignedUserOrOwnerOrReadOnly
from .models import Task, Category
from comments.models import Comment


class TaskList(generics.ListCreateAPIView):
    """
    - API endpoint for listing and creating tasks
    - Allow task create if logged in
    """
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

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
        'category',
        'category__title'
    ]
    search_fields = [
        'owner__username',
        'title',
        'description',
        'priority',
        'task_status',
        'created_date',
        'category__title'
    ]
    ordering_fields = [
        'comment_count',
    ]

    def get_queryset(self):
        """
        - Retrieve the queryset of tasks
        - Add filtering by category title
        - Add comment_count to each task
        """
        queryset = Task.objects.all()
        category_title = self.request.query_params.get('category__title', None)
        if category_title is not None:
            queryset = queryset.filter(category__title__iexact=category_title)
        queryset = Task.objects.annotate(
            comment_count=Count('comment', distinct=True),
        ).order_by('-created_date')
        return queryset

    def perform_create(self, serializer):
        """
        - Save created task and assign the owner
        """
        serializer.save(owner=self.request.user)


class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    - API endpoint to read, update & delete a single task
    """

    serializer_class = TaskDetailSerializer
    permission_classes = [IsAssignedUserOrOwnerOrReadOnly]
    queryset = Task.objects.annotate(
        comment_count=Count('comment', distinct=True),
    ).order_by('-created_date')


class StatusChoicesView(APIView):
    """
    - API endpoint for getting available task status choices
    """

    def get(self, request):
        status_choices = []
        for choice in Task.STATUS_CHOICES:
            status_choices.append({'value': choice[0], 'label': choice[1]})
        return Response(status_choices)


class PriorityChoicesView(APIView):
    """
    - API endpoint for getting available task priority choices
    """

    def get(self, request):
        priority_choices = []
        for choice in Task.PRIORITY_CHOICES:
            priority_choices.append({'value': choice[0], 'label': choice[1]})
        return Response(priority_choices)


class CategoryChoicesView(APIView):
    """
    - API endpoint for getting available category choices
    """

    def get(self, request):
        categories = Category.objects.all()
        category_choices = []
        for category in categories:
            category_choices.append({
                'value': category.id,
                'label': category.title
            })
        return Response(category_choices)
