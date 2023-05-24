from django.db import models

# Create your models here.

class WeekOfJobAssignments(models.Model):
    """"Model representing a week's worth of job assignments"""
    """Equivalent to one element of the schedulingData array on the client-side JavaScript"""
    weekNum = models.IntegerField(default = 1)
    weekData = models.JSONField(default = dict)

    def getJSON(self):
        """Return the JSON of the internal data"""
    
    def __str__(self):
        return f"JSON data for week {self.weekNum}"
        
    