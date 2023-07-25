from rest_framework import generics, permissions
from drf_api.permissions import IsOwnerOrReadOnly
from .models import Watcher
from watchers.serializers import WatcherSerializer


class WatcherList(generics.ListCreateAPIView):
    """
    List watchers or create a watcher if logged in.
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = WatcherSerializer
    queryset = Watcher.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class WatcherDetail(generics.RetrieveDestroyAPIView):
    """
    Retrieve a watcher or delete it by id if you own it.
    """
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = WatcherSerializer
    queryset = Watcher.objects.all()
