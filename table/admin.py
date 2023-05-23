from django.contrib import admin

# Register your models here.

from .models import SummerStaff, Job

admin.site.register(SummerStaff)
admin.site.register(Job)