# Generated by Django 3.2.19 on 2023-06-25 16:57

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('tasks', '0001_initial'),
        ('categories', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='related_tasks',
            field=models.ManyToManyField(blank=True, related_name='task', to='tasks.Task'),
        ),
    ]