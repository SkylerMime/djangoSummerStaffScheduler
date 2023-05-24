from django.db import models

# Create your models here.

SS_NAME_CHOICES = (
    ("abigail", "Abigail"),
    ("andrew", "Andrew"),
    ("azariah", "Azariah"),
    ("bethany", "Bethany"),
    ("britta", "Britta"),
    ("bryn", "Bryn"),
    ("emily", "Emily"),
    ("harley", "Harley"),
    ("heather", "Heather"),
    ("houston", "Houston"),
    ("ian", "Ian"),
    ("isaac", "Isaac"),
    ("jeffery", "Jeffery"),
    ("kerrianna", "Kerrianna"),
    ("madalyn", "Madalyn"),
    ("megan", "Megan"),
    ("milana", "Milana"),
    ("niks", "Niks"),
    ("noah", "Noah"),
    ("sebastian", "Sebastian"),
    ("sierra", "Sierra"),
    ("skyler", "Skyler"),
)

JOB_TYPE_CHOICES = (
    ('f', 'Field'),
    ('p', 'Plant'),
    ('c', 'Cleanup'),
)

JOB_CHOICES = (
    ('field_lead', 'Field Lead'),
    ('field_assists', 'Field Assists'),
    ('plant_cleaning', 'Plant Cleaning After Chapel'),
    ('house_cleaning', 'House Cleaning During Field'),
    ('water_duty', 'Water Duty'),
    ('layout_forklifts', 'Layout Forklifts'),
    ('field_dried_fruit', 'Field Dried Fruit'),
    ('early_morning_forklifting', 'Early Morning Forklifting'),
    ('tunnels', 'Tunnels'),
    ('plant_lead', 'Plant Lead'),
    ('tower', 'Tower'),
    ('stacker', 'Stacker'),
    ('speed', 'Speed'),
    ('dried_fruit', 'Dried Fruit'),
    ('auger', 'Auger'),
    ('floater', 'Floater'),
    ('bin_loader', 'Bin Loader'),
    ('take_away', 'Take Away'),
    ('backside', 'Backside'),
    ('yard', 'Yard'),
    ('clean-up_lead', 'Clean-up Lead'),
    ('pressure_washer_1', 'Pressure Washer 1'),
    ('pressure_washer_2', 'Pressure Washer 2'),
    ('pressure_washer_3', 'Pressure Washer 3'),
    ('pressure_washer_4', 'Pressure Washer 4'),
    ('pressure_washer_5', 'Pressure Washer 5'),
    ('area_1', 'Area 1 Middle'),
    ('area_2', 'Area 2 Inspection / Cutters'),
    ('area_3', 'Area 3 Backside / Stacker'),
    ('sanitizer', 'Sanitizer'),
)

class SummerStaff(models.Model):
    # fields
    name = models.CharField(max_length=31, choices=SS_NAME_CHOICES)
    
    # methods
    def __str__(self):
        """String for representing the SummerStaff object (in Admin site etc.)."""
        return self.name
        
class Job(models.Model):
    # fields
    jobName = models.CharField(max_length=31, choices=JOB_CHOICES)
    isForkliftJob = models.BooleanField(default=False)
    jobType = models.CharField(max_length=1, choices=JOB_TYPE_CHOICES)
    
    # methods
    def __str__(self):
        return f"Job Name: {self.get_jobName_display()}, Job Type: {self.get_jobType_display()}, Forklift Job: {self.isForkliftJob}"

class WeeklyJobAssignment(models.Model):
    """All of the people assigned to do a specific job some specific week"""
    weekNum = models.IntegerField # Should be the same as its parent
    job = models.OneToOneField(Job, on_delete=models.CASCADE)

class WeekOfJobAssignments(models.Model):
    """"Model representing a week's worth of job assignments"""
    """Equivalent to one element of the schedulingData array on the client-side JavaScript"""
    weekNum = models.IntegerField

    def getEquivalentJSON(self):
        """Return the JSON equivalent of the internal data"""
        
    