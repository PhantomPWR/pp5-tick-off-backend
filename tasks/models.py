from django.db import models
from django.utils import timezone
from datetime import date
# from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

from categories.models import Category

User = get_user_model()


class Task(models.Model):
    """
    Task model, related to 'owner', i.e. a User instance.
    Default image set so that we can always reference image.url.
    """

    STATUS_CHOICES = [
        ('BACKLOG', 'Backlog'),
        ('TODO', 'To Do'),
        ('INPROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed')
    ]

    PRIORITY_CHOICES = [
        ('PRIORITY1', '1'),
        ('PRIORITY2', '2'),
        ('PRIORITY3', '3')
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_date = models.DateTimeField(
        auto_now_add=True,
    )
    due_date = models.DateTimeField(
        auto_now=True,
        null=True,
        blank=True,
    )
    updated_date = models.DateTimeField(
        auto_now=True,
        null=True,
        blank=True,
    )
    completed_date = models.CharField(
        max_length=50,
        null=True,
        blank=True,
        default=''
    )
    assigned_to = models.ManyToManyField(
        User,
        blank=True,
        related_name='assigned_to'
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image = models.FileField(
        upload_to='images/',
        default='../default_post_bge1xm',
        blank=True,
        null=True
    )
    priority = models.CharField(
        max_length=25,
        choices=PRIORITY_CHOICES,
        default='PRIORITY1'
    )
    task_status = models.CharField(
        max_length=25,
        choices=STATUS_CHOICES,
        default='BACKLOG'
    )
    category = models.ForeignKey(
        'categories.Category',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    def save(self, *args, **kwargs):
        if self.task_status == 'COMPLETED':
            self.updated_date = date.today()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_date']

    def __str__(self):
        return f'{self.id} {self.title}'
