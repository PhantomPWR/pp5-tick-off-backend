from django.urls import path
from watchers import views

urlpatterns = [
    path('watchers/', views.WatcherList.as_view()),
    path('watchers/<int:pk>', views.WatcherDetail.as_view()),
]
