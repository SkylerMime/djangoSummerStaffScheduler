// global constants (for ease of editing)

const NUMBER_OF_WEEKS = 12;

const WORK_DAYS = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
];

const SS_NAMES = [
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
];
const DEFAULT_SS_NAME = 'X';

const FIELD_NONFORKLIFT_JOBS = [
    'Field Lead', 'Field Assists', 'Plant Cleaning (people who start right away after chapel)', 'House Cleaning During Field', 'Water Duty'
];
const FIELD_FORKLIFT_JOBS = [
    'Layout Forklifts', 'Field Dried Fruit', 'Early Morning Forklifting', 'Tunnels'
];
const FIELD_JOBS = FIELD_NONFORKLIFT_JOBS.concat(FIELD_FORKLIFT_JOBS);

const PLANT_NONFORKLIFT_JOBS = [
    'Plant Lead','Tower','Stacker','Speed','Dried Fruit','Auger','Floater'
];
const PLANT_FORKLIFT_JOBS = [
    'Bin Loader','Take Away','Backside','Yard'
];
const PLANT_JOBS = PLANT_NONFORKLIFT_JOBS.concat(PLANT_FORKLIFT_JOBS);

const CLEANUP_JOBS = [
    'Clean-up Lead', 'Pressure Washer 1', 'Pressure Washer 2', 'Pressure Washer 3', 'Pressure Washer 4', 'Pressure Washer 5', 'Area 1 Middle', 'Area 2 Inspection / Cutters', 'Area 3 Backside / Stacker', 'Sanitizer'
];

const FORKLIFT_JOBS = FIELD_FORKLIFT_JOBS.concat(PLANT_FORKLIFT_JOBS);

const ALL_JOBS = [FIELD_JOBS, PLANT_JOBS, CLEANUP_JOBS];