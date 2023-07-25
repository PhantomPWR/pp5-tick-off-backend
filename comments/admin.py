from django.contrib import admin

from .models import Comment

"""
Register admin for the comments app
"""
admin.site.register(Comment)
