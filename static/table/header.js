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
    'Field Lead',
    'Field Assist 1', 'Field Assist 2', 'Field Assist 3', 'Field Assist 4', 'Field Assist 5', 'Field Assist 6',
    'Plant Cleaning (people who start right away after chapel)', 'House Cleaning During Field', 'Water Duty'
];
const FIELD_FORKLIFT_JOBS = [
    'Layout Forklift 1', 'Layout Forklift 2', 'Layout Forklift 3', 'Layout Forklift 4',
    'DF Pickup FL 1', 'DF Pickup FL 2', 'DF Pickup FL 3',
    'Placement 1', 'Placement 2', 'Placement 3',
    'Tunnels'
];
const FIELD_JOBS = FIELD_NONFORKLIFT_JOBS.concat(FIELD_FORKLIFT_JOBS);

const PLANT_NONFORKLIFT_JOBS = [
    'Plant Lead',
    'Tower 1', 'Tower 2', 'Tower 3',
    'Stacker 1', 'Stacker 2', 'Stacker 3',
    'Speed',
    'Dried Fruit 1', 'Dried Fruit 2', 'Dried Fruit 3',
    'Auger',
    'Floater 1', 'Floater 2', 'Floater 3', 'Floater 4', 'Floater 5', 'Floater 6',
];
const PLANT_FORKLIFT_JOBS = [
    'Bin Loader','Take Away','Backside','Yard'
];
const PLANT_JOBS = PLANT_NONFORKLIFT_JOBS.concat(PLANT_FORKLIFT_JOBS);

const CLEANUP_JOBS = [
    'Clean-up Lead','Pressure Washer 1','Pressure Washer 2','Pressure Washer 3','Pressure Washer 4','Pressure Washer 5',
    'Area 1 Middle','Area 2 Inspection / Cutters','Area 3 Backside / Stacker',
    'Sanitizer 1', 'Sanitizer 2',
    'Broom/Shovel 1', 'Broom/Shovel 2', 'Broom/Shovel 3', 'Broom/Shovel 4',
];

const FORKLIFT_JOBS = FIELD_FORKLIFT_JOBS.concat(PLANT_FORKLIFT_JOBS);

const ALL_JOBS = [FIELD_JOBS, PLANT_JOBS, CLEANUP_JOBS];

// // this shows which jobs require multiple people and the number of those people
// const MULTIPLE_PEOPLE_JOBS = {
//     'Tower': 3,
//     'Stacker': 3,
//     'Dried Fruit': 3,
//     'Floater': 6,
//     'Field Assist': 6,
//     'Layout Forklift': 4,
//     'DF Pickup FL': 3,
//     'Placement': 3,
//     'Sanitizer': 2,
//     'Broom/Shovel': 4,
// }