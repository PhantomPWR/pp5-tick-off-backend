from rest_framework import permissions
from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    - Base task permissions allowing:
        - Task owner to modify the task
        - Everyone to view the task
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user


class IsAssignedUserOrOwnerOrReadOnly(BasePermission):
    """
    - Custom permission to only allow assigned user
      and task owner to update task status
    """

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        return obj.assigned_to == request.user or obj.owner == request.user
