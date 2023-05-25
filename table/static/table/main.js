/* Goals:

DONE:
Implement saving records in the database!
Dropdown checks for duplicates
Buttons for week and job type switching
Export files named after the day of the download

GOALS:
Counting times each SS is scheduled for a certain job over the weeks
Be able to schedule multiple summer staff for certain jobs, such as floater and layout forklifts
Error message: Limit to two forklifting jobs per day (make dismissable)
Sort people based on skill level for each position
Export as formatted excel? (Or just make it look nice visually)
Remember current week in local storage
*/

/*
Notes:
This makes use of Handsontable and ispinjs, which can be found here:
https://github.com/uNmAnNeR/ispinjs
*/

// JavaScript for the scheduler
const container = document.querySelector('#schedulingTable');
// const fileElement = document.getElementById('file');
const spinnerElement = document.getElementById("weekSpinner");
const jobTypeElement = document.getElementById("jobTypeButton");

const date = new Date();

// get the security cookie
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

// class declarations

class WeeklyJobAssignment {
    constructor(id, jobName, dayNames = WORK_DAYS) {
        this.id = id;
        this.Job = jobName;
        for (const dayName of dayNames) {
            this[dayName] = '';
        }
    }
}

/**
 * Returns an array of job assignments for the week for a specific job, where each element has data for that specific job for every day
 *
 * @param jobType an array of job names for a specific type
 * @return {Array} of job assignments for the week
*/
function getWeeklyJobAssignments(jobNames = PLANT_JOBS, dayNames = WORK_DAYS) {
    const weeklyJobAssignments = [];
    for (let jobIndex = 0; jobIndex < jobNames.length; jobIndex++) {
        weeklyJobAssignments[jobIndex] = new WeeklyJobAssignment(jobIndex, jobNames[jobIndex]);
    }
    return weeklyJobAssignments;
}

function getWeekAllJobs(jobTypes = ALL_JOBS, dayNames = WORK_DAYS) {
    const weeklyAllJobAssignments = [];
    for (let jobTypeIndex = 0; jobTypeIndex < jobTypes.length; jobTypeIndex++) {
        weeklyAllJobAssignments[jobTypeIndex] = getWeeklyJobAssignments(jobTypes[jobTypeIndex]);
    }
    return weeklyAllJobAssignments;
}

/**
 * Returns a column of data (for a single day) after checking rows (of jobs)
 * @param {string} dayName the day to filter by
 * @param {Array} week the array of job objects for the week
 * @returns {Array} of names for the dayName
 */
function getColumn(dayName, week) {
    const column = [];
    for (const job of week) {
        column.push(job[dayName]);
    }
    return column;
}

/**
 * Returns an array of weeks,
 * where each element is an arrays of days,
 * where each element is an unused name
 *
 * @return {Array} of weeks of job types of days of unused names, three-dimensional
 */
function getUnusedNames(weekIndex, jobTypeIndex, allNames = SS_NAMES, dayNames = WORK_DAYS, numWeeks = NUMBER_OF_WEEKS, numDays = WORK_DAYS.length, data = schedulingData, jobTypes = ALL_JOBS) {
    const weekOfJobTypeNames = [];
    for (const dayName of dayNames) {
        let usedNames = getColumn(dayName, data[weekIndex][jobTypeIndex]);
        // filter all the names, removing those already used today.
        weekOfJobTypeNames[dayName] = allNames.filter(name => !usedNames.includes(name));
    }
    return weekOfJobTypeNames;
}

// function downloadData(filename, text) {
//     const element = document.createElement('a');
//     element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
//     element.setAttribute('download', filename);

//     element.style.display = 'none';
//     document.body.appendChild(element);

//     element.click();

//     document.body.removeChild(element);
// }

// reset the table
function resetTable() {
    currentJobNames = ALL_JOBS[currentJobType];
    ssTable.updateData(schedulingData[currentWeek][currentJobType]);
    ssTable.updateSettings({
        rowHeaders: currentJobNames
    });
    unusedNames = getUnusedNames(currentWeek, currentJobType);
}

/*
* For the given week, day, and person, count the number of forklift jobs they are scheduled for.
*/
function countForkliftJobs(weekNum, dayName, personName, jobsToCount = FORKLIFT_JOBS) {
    // TODO
}

// Simple function for displaying warning messages
function warning(message) {
    document.getElementById("warningMessageSpot").innerText = message;
}

// begin from brennantymrak.com and ChatGPT

// Function to fetch data from the server and update the table
function loadDataFromServer() {
    fetch('/table/json-job-assignments-get/', {
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    })
    .then(response => {
        return response.json()
    })
    .then(data => {
        schedulingData = data["received_data"]["instance"];
        resetTable();
    })
    .catch(error => {
        console.error('Error loading data:', error);
        warning('Error loading data. Please try again.');
    });
}

// Function to send data to the server and save it.
function saveDataToServer() {
    fetch('/table/json-job-assignments-post/', {
        method: 'POST',
        mode: 'same-origin', // from HOT example
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({'post_data': schedulingData}),
    })
        .then(response => {
            if (response.ok) {
                console.log('Data saved successfully.');
            } else {
                console.error('Error saving data:', response.status);
                warning('Error saving data. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error saving data:', error);
            warning('Error saving data. Please try again.');
        });
}

// end credit


// Scheduling data is the main structure for the data for each week
// It cannot be directly displayed on the Handsontable
let schedulingData = [];

// Initiazlie a blank table
for (let weekNum = 0; weekNum < NUMBER_OF_WEEKS; weekNum++) {
    // initialize each element of the array (each week) with an object of days
    schedulingData[weekNum] = getWeekAllJobs();
}

let currentWeek = 0;
let currentJobType = 0;
let currentJobNames = ALL_JOBS[currentJobType];
let unusedNames = getUnusedNames(currentWeek, currentJobType);

const ssTable = new Handsontable(container, {
    data: schedulingData[currentWeek][currentJobType],
    height: 'auto',
    width: 'auto',
    colWidths: [100, 100, 100, 100, 100, 100],
    rowHeaderWidth: 125,
    colHeaders: WORK_DAYS,
    rowHeaders: currentJobNames,
    columns: [
        //{ data: 'Job' },
        {
            data: 'Monday',
            type: 'dropdown',
            source: SS_NAMES
        },
        {
            data: 'Tuesday',
            type: 'dropdown',
            source: SS_NAMES
        },
        {
            data: 'Wednesday',
            type: 'dropdown',
            source: SS_NAMES
        },
        {
            data: 'Thursday',
            type: 'dropdown',
            source: SS_NAMES
        },
        {
            data: 'Friday',
            type: 'dropdown',
            source: SS_NAMES
        }
    ],
    licenseKey: 'non-commercial-and-evaluation', // for non-commerical use only
    afterChange: function () {
        // update the unused names list every time the user clicks on the table
        unusedNames = getUnusedNames(currentWeek, currentJobType);
        let colSource;
        // skip over the column with the job names
        for (let dayIndex = 0; dayIndex < WORK_DAYS.length; dayIndex++) {
            colSource = unusedNames[WORK_DAYS[dayIndex]];
            colSource.unshift(DEFAULT_SS_NAME);
            for (let row = 0; row < ALL_JOBS[currentJobType].length; row++) {
                // update the source to use the filtered list of names
                this.setCellMeta(row, dayIndex, 'source', colSource);
            }
        }

        // check for the warning message for more than two forklift jobs in the current week.
        // TODO!
    }
});

loadDataFromServer();
resetTable();

// // some things must be done every time the table is clicked
// container.addEventListener("click", () => {
//     doTableUpdateEvents();
// });

// make the weeks spinner
const spinner = new ISpin(spinnerElement, {
    min: 1,
    max: NUMBER_OF_WEEKS,
    onChange: () => {
        // off by one because the first week is [0] internally
        currentWeek = spinner.value - 1;
        resetTable();
    }
});

spinner.value = 1;

// update the job type based on the job switching button
jobTypeElement.onclick = () => {
    currentJobType++;
    // overflow
    if (currentJobType >= ALL_JOBS.length) {
        currentJobType = 0;
    }
    switch (currentJobType) {
        case 0: jobTypeElement.innerHTML = 'Field'; break;
        case 1: jobTypeElement.innerHTML = 'Plant'; break;
        case 2: jobTypeElement.innerHTML = 'Cleanup'; break;
    }
    resetTable();
};

// save button
document.getElementById("saveButton").onclick= saveDataToServer;
// load button
document.getElementById("loadButton").onclick= () => {
    loadDataFromServer();
    resetTable();
};

// // save button
// document.getElementById("saveButton").onclick= () => {
//     localStorage.setItem("lastSave", JSON.stringify(schedulingData));
// };

// // load button
// document.getElementById("loadButton").onclick= () => {
//     if (localStorage.getItem("lastSave")) {
//         schedulingData = JSON.parse(localStorage.getItem("lastSave"));
//         resetTable();
//     } else {
//         warning("No saved data detected");
//     }
// };

// export button
const exportPlugin = ssTable.getPlugin('exportFile');

document.getElementById("exportButton").onclick= () => {
    exportPlugin.downloadFile('csv', {
        bom: false,
        columnHeaders: true,
        exportHiddenColumns: false,
        exportHiddenRows: false,
        fileExtension: 'csv',
        filename: 'Scheduling-Data_[YYYY]-[MM]-[DD]',
        mimeType: 'text/csv',
        rowHeaders: true
    });
};

// // download button
// document.getElementById("downloadButton").onclick= () => {
//     // make today's date
//     const year = (date.getFullYear() - 2000);
//     const month = date.getMonth();
//     const day = date.getDate();
//     const parsedDate = `${month}-${day}-${year}`;
//     downloadData(`Schedule_Data_${parsedDate}.JSON`, JSON.stringify(schedulingData));
// };

// upload scheduling data if the user uploads a new file
// document.getElementById("uploadButton").onclick = () => {

//     let fileElement = document.getElementById('jsonFile');

//     // check if there is a file selected
//     if (fileElement.isDefaultNamespace.length === 0) {
//         alert('please choose a file');
//     }
//     else {
//         // read the file object into a string
//         let reader = new FileReader();
//         reader.addEventListener("load", () => {
//             schedulingData = JSON.parse(reader.result);
//         });
//         reader.readAsText(fileElement.files[0]);
//         resetTable();
//     }
// }

//warning("This is a test error message");