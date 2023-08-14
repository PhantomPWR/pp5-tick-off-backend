from django.http import Http404, JsonResponse
from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework import serializers
from rest_framework import (
    filters,
    generics,
    permissions,
    status,
)
from .models import Category
from .serializers import (
    CategorySerializer,
    CategoryDetailSerializer
)


class CategoryList(generics.ListCreateAPIView):
    """
    - List all categories
    - Create category if logged in
    """

    serializer_class = CategorySerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    queryset = Category.objects.all()

    filter_backends = [
        filters.OrderingFilter,
        filters.SearchFilter,
        DjangoFilterBackend
    ]
    filterset_fields = [
        'title',
        'description',
    ]
    search_fields = [
        'title',
        'description',
    ]

    def perform_create(self, serializer):
        serializer.save()


class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    - Get single category detail
    """

    serializer_class = CategoryDetailSerializer
    queryset = Category.objects.all()

    def get_object(self):
        try:
            category_id = self.kwargs['pk']  # Retrieve the category ID/PK from the URL parameters
            return self.queryset.get(pk=id)
        except Category.DoesNotExist:
            raise Http404
