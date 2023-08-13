from django.contrib import admin
from .models import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    pass


Category._meta.verbose_name_plural = "Categories"
