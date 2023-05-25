from django.db import models

# Create your models here.

class JobAssignments(models.Model):
    """"Model representing all job assignments"""
    """Equivalent to the schedulingData array on the client-side JavaScript"""
    id = models.IntegerField(default = 1, primary_key=True)
    data = models.JSONField(default = dict)

    def __str__(self):
        return f"JSON data"
        
    