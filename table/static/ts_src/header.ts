// global constants (for ease of editing)

const NUMBER_OF_WEEKS: number = 12;

const WORK_DAYS: string[] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
];

const SS_NAMES: string[] = [
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

interface SummerStaffObject {
    label: string;
    id: number;
}

let SS_CHOSEN_NAMES: SummerStaffObject[] = [];
for (let i = 0; i < SS_NAMES.length; i++) {
    SS_CHOSEN_NAMES.push(
        {id: i,
        label: SS_NAMES[i]}
    )
}

const FIELD_NONFORKLIFT_JOBS: string[] = [
    'Field Lead',
    'Field Assist',
    'Plant Cleaning', 'House Cleaning', 'Water Duty'
];
const EARLY_FIELD_FORKLIFT_JOBS: string[] = [
    'Placement',
    'Tunnels'
];
const DRIED_FRUIT_PICKUP_FORKLIFT_JOBS: string[] = [
    'DF Pickup FL',
];
const LATE_FIELD_FORKLIFT_JOBS: string[] = [
    'Layout Forklift',
].concat(DRIED_FRUIT_PICKUP_FORKLIFT_JOBS);
const FIELD_FORKLIFT_JOBS = EARLY_FIELD_FORKLIFT_JOBS.concat(LATE_FIELD_FORKLIFT_JOBS);
const FIELD_JOBS = FIELD_NONFORKLIFT_JOBS.concat(FIELD_FORKLIFT_JOBS);

const PLANT_NONFORKLIFT_JOBS: string[] = [
    'Plant Lead',
    'Tower',
    'Stacker',
    'Speed',
    'Dried Fruit',
    'Auger',
    'Floater',
];
const PLANT_FORKLIFT_JOBS: string[] = [
    'Bin Loader','Take Away','Backside','Yard'
];
const PLANT_JOBS = PLANT_NONFORKLIFT_JOBS.concat(PLANT_FORKLIFT_JOBS);

const CLEANUP_JOBS: string[] = [
    'Clean-up Lead','Pressure Washer 1','Pressure Washer 2','Pressure Washer 3','Pressure Washer 4','Pressure Washer 5',
    'Area 1 Middle','Area 2 Inspection / Cutters','Area 3 Backside / Stacker',
    'Sanitizer',
    'Broom/Shovel',
];

const FORKLIFT_JOBS = FIELD_FORKLIFT_JOBS.concat(PLANT_FORKLIFT_JOBS);

const ALL_JOBS = [FIELD_JOBS, PLANT_JOBS, CLEANUP_JOBS];
const ALL_JOBS_CONCAT = FIELD_JOBS.concat(PLANT_JOBS).concat(CLEANUP_JOBS);

// There are some jobs that occur at the same time, and the application will prevent/warn against overlaps:

const OVERLAPS: string[][] = [
    FIELD_NONFORKLIFT_JOBS, // no one can be on two field non-forklift-jobs in the same day
    EARLY_FIELD_FORKLIFT_JOBS,
    LATE_FIELD_FORKLIFT_JOBS, // no one can be on Placement (E.M.F.) and Tunnels in the same day
    PLANT_JOBS.filter(function(item) {
        return item !== 'Backside'
    }).concat(DRIED_FRUIT_PICKUP_FORKLIFT_JOBS), // no one can be on DF Pickup and a Plant job in the same day, or Two Plant Jobs in the same day, unless that plant job is Backside.
    CLEANUP_JOBS, // no one can be on two cleanup jobs in the same day
];

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