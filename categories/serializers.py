from rest_framework import serializers
from .models import Category
from tasks.models import Task


class CategorySerializer(serializers.ModelSerializer):
    title = serializers.CharField(max_length=100)
    description = serializers.CharField(max_length=255)
    related_tasks = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Task.objects.all(),
    )

    class Meta:
        model = Category
        fields = [
            'title',
            'description',
            'related_tasks',
        ]


class CategoryDetailSerializer(CategorySerializer):
    title = serializers.CharField(max_length=100)
    description = serializers.CharField(max_length=255)
    related_tasks = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Task.objects.all(),
    )

    class Meta:
        model = Category
        fields = [
            'title',
            'description',
            'related_tasks',
        ]
