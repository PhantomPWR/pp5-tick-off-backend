from django.contrib import admin
from django.urls import path, include
from .views import root_route, logout_route
# from tasks.views import status_choices_view, TaskList, TaskDetail
from tasks.views import TaskList, TaskDetail

urlpatterns = [
    path('', root_route),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    # our logout route has to be above the default one to be matched first
    path('dj-rest-auth/logout/', logout_route),
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path(
        'dj-rest-auth/registration/',
        include('dj_rest_auth.registration.urls')
    ),
    # path('status-choices/', status_choices_view, name='status-choices'),
    path('', include('profiles.urls')),
    path('', include('tasks.urls')),
    path('', include('categories.urls')),
    path('', include('comments.urls')),
]
