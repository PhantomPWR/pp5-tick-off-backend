from django.db import IntegrityError
from rest_framework import serializers
from .models import Watcher


class WatcherSerializer(serializers.ModelSerializer):

    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Watcher
        fields = [
            'id', 'created_at', 'owner', 'task_watched'
        ]

    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError({
                'detail': 'You\'re already watching this task'
            })
