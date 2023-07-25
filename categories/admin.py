from django.contrib import admin
from .models import Category


class CategoryAdmin(admin.ModelAdmin):

    class Meta:
        verbose_name_plural = "Categories"


admin.site.register(Category, CategoryAdmin)
