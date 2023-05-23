# constants.py

# TODO: This and "static/table/header.js" may not both be necessary

"""defines constants for the table app"""

NUMBER_OF_WEEKS = 12;

SS_NAMES = (
    "Abigail",
    "Andrew",
    "Azariah",
    "Bethany",
    "Britta",
    "Bryn",
    "Emily",
    "Harley",
    "Heather",
    "Houston",
    "Ian",
    "Isaac",
    "Jeffery",
    "Kerrianna",
    "Madalyn",
    "Megan",
    "Milana",
    "Niks",
    "Noah",
    "Sebastian",
    "Sierra",
    "Skyler",
)

WORK_DAYS = (
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
)

FIELD_NONFORKLIFT_JOBS = (
    'Field Lead', 'Field Assists', 'Plant Cleaning (people who start right away after chapel)', 'House Cleaning During Field', 'Water Duty'
)
FIELD_FORKLIFT_JOBS = (
    'Layout Forklifts', 'Field Dried Fruit', 'Early Morning Forklifting', 'Tunnels'
)
FIELD_JOBS = FIELD_NONFORKLIFT_JOBS + FIELD_FORKLIFT_JOBS

PLANT_NONFORKLIFT_JOBS = (
    'Plant Lead', 'Tower', 'Stacker', 'Speed', 'Dried Fruit', 'Auger', 'Floater'
)
PLANT_FORKLIFT_JOBS = (
    'Bin Loader', 'Take Away', 'Backside', 'Yard'
)
PLANT_JOBS = PLANT_NONFORKLIFT_JOBS + PLANT_FORKLIFT_JOBS

CLEANUP_JOBS = (
    'Clean-up Lead', 'Pressure Washer 1', 'Pressure Washer 2', 'Pressure Washer 3', 'Pressure Washer 4', 'Pressure Washer 5', 'Area 1 Middle', 'Area 2 Inspection / Cutters', 'Area 3 Backside / Stacker', 'Sanitizer'
)

FORKLIFT_JOBS = FIELD_FORKLIFT_JOBS + PLANT_FORKLIFT_JOBS

ALL_JOBS = (FIELD_JOBS, PLANT_JOBS, CLEANUP_JOBS)