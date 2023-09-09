from django.utils import timezone
from django.contrib.humanize.templatetags.humanize import naturaltime
from rest_framework import serializers
from django.contrib.auth.models import User
from tasks.models import Task
from categories.models import Category
from comments.models import Comment


class AssignedToSerializer(serializers.ModelSerializer):
    """
    - Serializer for the AssignedTo model
    """
    class Meta:
        model = User
        fields = ['id', 'username']


class TaskSerializer(serializers.ModelSerializer):
    """
    - Serializer for the Task model
    """
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')
    comment_count = serializers.ReadOnlyField()
    completed_date = serializers.ReadOnlyField()
    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
    )
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
    )
    category_title = serializers.SerializerMethodField()

    def get_category_title(self, obj):
        return obj.category.title

    def get_is_owner(self, obj):
        """
        - Check if user making request is the owner
          of the Task object
        """
        request = self.context.get('request')
        if request:
            return request.user == obj.owner
        return False

    def update(self, instance, validated_data):
        """
        - Updates the Task object with the supplied validated data
        - Set completed_date if task_status has changed to 'COMPLETED'
        """
        if ('task_status' in validated_data and
           validated_data['task_status'] == 'COMPLETED'):
            instance.completed_date = timezone.now()
        return super().update(instance, validated_data)

    def get_priority(self, obj):
        """
        - Return the Priority Field display value
          for the given Task object
        """
        return obj.get_priority_display()

    def get_status(self, obj):
        """
        - Return the Status Field display value
          for the given Task object
        """
        return obj.get_status_display()

    class Meta:
        model = Task
        fields = [
            'id',
            'owner',
            'is_owner',
            'assigned_to',
            'title',
            'category',
            'category_title',
            'description',
            'image',
            'profile_id',
            'profile_image',
            'priority',
            'task_status',
            'created_date',
            'due_date',
            'updated_date',
            'completed_date',
            'comment_count',
        ]


class TaskDetailSerializer(TaskSerializer):
    """
    - Serializer for the TaskDetail model
    - Inherits from TaskSerializer
    """
    task = serializers.ReadOnlyField(source='task.id')

    """
    - Convert supplied Task object to a representation
      suitable for response payloads
    """
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['category_title'] = instance.category.title
        return data

    class Meta:
        model = Task
        fields = [
            'id',
            'owner',
            'is_owner',
            'assigned_to',
            'title',
            'category',
            'category_title',
            'description',
            'image',
            'profile_id',
            'profile_image',
            'priority',
            'task_status',
            'created_date',
            'due_date',
            'updated_date',
            'completed_date',
            'task',
            'comment_count',
        ]


class StatusChoicesSerializer(serializers.Serializer):
    """
    - Serializer for Task model Status Field choices
    """
    value = serializers.CharField(max_length=25)
    label = serializers.CharField(max_length=25)


class PriorityChoicesSerializer(serializers.Serializer):
    """
    - Serializer for Task model Priority Field choices
    """
    value = serializers.CharField(max_length=25)
    label = serializers.CharField(max_length=25)


class CategoryChoicesSerializer(serializers.Serializer):
    """
    - Serializer for Task model Category Field choices
    """
    value = serializers.CharField(max_length=25)
    label = serializers.CharField(max_length=25)


