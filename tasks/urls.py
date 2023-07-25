from django.urls import path
from tasks import views

urlpatterns = [
     path('tasks/', views.TaskList.as_view()),
     path('tasks/<int:pk>/', views.TaskDetail.as_view()),
     path('status-choices/',
          views.StatusChoicesView.as_view(),
          name='status_choices'
          ),
     path('priority-choices/',
          views.PriorityChoicesView.as_view(),
          name='priority_choices'
          ),
     path('category-choices/',
          views.CategoryChoicesView.as_view(),
          name='category_choices'
          ),
]
