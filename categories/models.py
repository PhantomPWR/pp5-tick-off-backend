from django.db import models


class Category(models.Model):
    """
    - Model for Categories
    - Used to group Tasks within a category.
    """
    title = models.CharField(max_length=50, null=False, blank=False)
    description = models.CharField(max_length=150)
    related_tasks = models.ManyToManyField(
        'tasks.Task',
        related_name="task",
        blank=True,
    )

    def __str__(self):
        return str(self.title)
