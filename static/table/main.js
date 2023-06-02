/* Goals:

DONE:
Implement saving records in the database!
Dropdown checks for duplicates
Buttons for week and job type switching
Export files named after the day of the download
Error message: Limit to two forklifting jobs per day (make dismissable)
Be able to schedule multiple summer staff for certain jobs, such as floater and layout forklifts

GOALS:
Counting times each SS is scheduled for a certain job over the weeks
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
 * Returns an array of job assignments for the week for a specific type, where each element has data for that specific job for every day
 *
 * @param jobNames an array of job names for a specific type
 * @return {Array} of job assignments for the week of a specific type
*/
function getOneTypeWeeklyJobAssignments(jobNames = PLANT_JOBS, dayNames = WORK_DAYS) {
    const oneTypeWeeklyJobAssignments = [];
    for (let jobIndex = 0; jobIndex < jobNames.length; jobIndex++) {
        oneTypeWeeklyJobAssignments[jobIndex] = new WeeklyJobAssignment(jobIndex, jobNames[jobIndex]);
    }
    return oneTypeWeeklyJobAssignments;
}

/**
 * Returns an array of 
 * 
 * @param {Array} jobTypes the different types of jobs, e.g. "Field", "Plant", "Cleanup". Two-dimensional.
 * @param {Array} dayNames the work days of the week
 * @returns {Array} where each element is all the jobs of one type.
 */
function getWeekAllJobs(jobTypes = ALL_JOBS, dayNames = WORK_DAYS) {
    const weeklyAllJobAssignments = [];
    for (let jobTypeIndex = 0; jobTypeIndex < jobTypes.length; jobTypeIndex++) {
        weeklyAllJobAssignments[jobTypeIndex] = getOneTypeWeeklyJobAssignments(jobTypes[jobTypeIndex]);
    }
    return weeklyAllJobAssignments;
}

// /**
//  * Returns a column of data (for a single day) after checking rows (of jobs)
//  * @param {string} dayName the day to filter by
//  * @param {Array} week the array of job objects for the week
//  * @returns {Array} of names for the dayName
//  */
// function getColumn(dayName, week) {
//     const column = [];
//     for (const job of week) {
//         column.push(job[dayName]);
//     }
//     return column;
// }

/**
 * 
 * @param {string} jobName the name of the job in this cell
 * @param {Array} jobsToFilter list of all the jobs to filter through.
 * @param {Array} conflictsList 
 * @returns {Array} of all the jobs that have a conflict with this job, excluding this job.
 */
function getConflictingJobsList(jobName, jobsToFilter = ALL_JOBS_CONCAT, conflictsList = OVERLAPS) {
    let conflictingJobsList = [];
    for (overlapPart of conflictsList) {
        if (overlapPart.includes(jobName)) {
            conflictingJobsList = conflictingJobsList.concat(overlapPart);
        }
    }
    return conflictingJobsList.filter(name => (name !== jobName)); // remove this job from the list
}

/**
 * Get all the summer staff still available for jobs, given a specific list of conflicts
 * on a specific day for a specific jobType (Plant, Field, or Cleanup).
 * 
 * Note: You'll want to include the name in this cell in the finished list to prevent incorrect validation erros.
 * 
 * @param {Array} conflictingJobs the jobs that cannot be scheduled at the same time.
 * @returns {Array} of names that havent't been given jobs of this conflict type today.
 */
function getNonconflictingSummerStaffObjects(conflictingJobs, weekIndex, jobTypeIndex, dayName, allStaff = SS_CHOSEN_NAMES) {
    const jobsToIterateThrough = schedulingData[weekIndex][jobTypeIndex];
    const conflictingSummerStaff = [];
    // get the name of the Summer Staffers doing each conflicting job today.
    for (const conflictingJob of conflictingJobs) {
        // find that job in the jobsToIterateThrough
        for (const jobObject of jobsToIterateThrough) {
            if (conflictingJob === jobObject.Job) {
                // parse this string into every individual id, then add the object to the Summer Staff list
                arrayOfIds = jobObject[dayName].split(",");
                // add the Summer Staff for this job today to the list
                for (const id of arrayOfIds) {
                    conflictingSummerStaff.push(
                        SS_CHOSEN_NAMES[id] // add this SummerStaff object to the list
                    );
                } // end for               
            } // end if
        } // end for
    } // end for

    // return the inverse of this list
    return allStaff.filter(summerStaff => !conflictingSummerStaff.includes(summerStaff));
}

// /**
//  * Returns an array of weeks,
//  * where each element is an arrays of days,
//  * where each element is an unused name
//  *
//  * @return {Array} of weeks of job types of days of unused names, three-dimensional
//  */
// function getUnusedNames(weekIndex, jobTypeIndex, allNames = SS_NAMES, dayNames = WORK_DAYS, numWeeks = NUMBER_OF_WEEKS, numDays = WORK_DAYS.length, data = schedulingData, jobTypes = ALL_JOBS) {
//     const weekOfJobTypeNames = [];
//     for (const dayName of dayNames) {
//         let usedNames = getColumn(dayName, data[weekIndex][jobTypeIndex]);
//         // filter all the names, removing those already used today.
//         weekOfJobTypeNames[dayName] = allNames.filter(name => !usedNames.includes(name));
//     }
//     return weekOfJobTypeNames;
// }

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
    //unusedNames = getUnusedNames(currentWeek, currentJobType);
}

/*
* For the given week, day, and person, count the number of forklift jobs they are scheduled for.
*/
function countForkliftJobs(weekNum, dayName, summerStaffObject, jobsToCount = FORKLIFT_JOBS, jobTypes = ALL_JOBS) {
    let sum = 0;
    const allTypesInWeek = schedulingData[weekNum]
    for (let jobTypeIndex = 0; jobTypeIndex < jobTypes.length; jobTypeIndex++) {
        for (let jobIndex = 0; jobIndex < jobTypes[jobTypeIndex].length; jobIndex++) {
            if (allTypesInWeek[jobTypeIndex][jobIndex][dayName].split(',').includes(summerStaffObject.id.toString()) &&
                (jobsToCount.includes(allTypesInWeek[jobTypeIndex][jobIndex].Job))) {
                sum++;
            }
        }
    }
    return sum;
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
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        schedulingData = data["received_data"];
        resetTable();
    })
    .catch((error) => {
        console.error(`Error loading data: ${error}`);
        warning('Error loading data. See developer console for more information.');
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

// from GitHub
function customDropdownRenderer(instance, td, row, col, prop, value, cellProperties) {
    var selectedId;
    var optionsList = cellProperties.chosenOptions.data;

    if(typeof optionsList === "undefined" || typeof optionsList.length === "undefined" || !optionsList.length) {
        Handsontable.cellTypes.text.renderer(instance, td, row, col, prop, value, cellProperties);
        return td;
    }

    var values = (value + "").split(",");
    value = [];
    for (var index = 0; index < optionsList.length; index++) {

        if (values.indexOf(optionsList[index].id + "") > -1) {
            selectedId = optionsList[index].id;
            value.push(optionsList[index].label);
        }
    }
    value = value.join(", ");

    Handsontable.cellTypes.text.renderer(instance, td, row, col, prop, value, cellProperties);
    return td;
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

// get the current week and job type from local storage, if applicable

let currentWeek = 0;
if (localStorage.getItem("lastCurrentWeek")) {
    currentWeek = Number(localStorage.getItem("lastCurrentWeek"));
}

let currentJobType = 0;
if (localStorage.getItem("lastCurrentJobType")) {
    currentJobType = Number(localStorage.getItem("lastCurrentJobType"));
}



let currentJobNames = ALL_JOBS[currentJobType];
//let unusedNames = getUnusedNames(currentWeek, currentJobType);

const ssTable = new Handsontable(container, {
    data: schedulingData[currentWeek][currentJobType],
    height: 'auto',
    width: 'auto',
    colWidths: [175, 175, 175, 175, 175],
    rowHeaderWidth: 150,
    colHeaders: WORK_DAYS,
    rowHeaders: currentJobNames,
    columns: [
        //{ data: 'Job' },
        {
            data: 'Monday',
            renderer: customDropdownRenderer,
            editor: "chosen",
            chosenOptions: {
                multiple: true,
                data: SS_CHOSEN_NAMES,
            }
        },
        {
            data: 'Tuesday',
            renderer: customDropdownRenderer,
            editor: "chosen",
            chosenOptions: {
                multiple: true,
                data: SS_CHOSEN_NAMES,
            }
        },
        {
            data: 'Wednesday',
            renderer: customDropdownRenderer,
            editor: "chosen",
            chosenOptions: {
                multiple: true,
                data: SS_CHOSEN_NAMES,
            }
        },
        {
            data: 'Thursday',
            renderer: customDropdownRenderer,
            editor: "chosen",
            chosenOptions: {
                multiple: true,
                data: SS_CHOSEN_NAMES,
            }
        },
        {
            data: 'Friday',
            renderer: customDropdownRenderer,
            editor: "chosen",
            chosenOptions: {
                multiple: true,
                data: SS_CHOSEN_NAMES,
            }
        }
    ],
    licenseKey: 'non-commercial-and-evaluation', // for non-commerical use only
    afterChange: function () {
        // dynamically update the dropdown menus to prevent scheduling summer staff in overlapping jobs.
        for (let col = 0; col < WORK_DAYS.length; col++) {
            for (let row = 0; row < ALL_JOBS[currentJobType].length; row++) {
                // create the array of conflicts for the job type for this specific job.
                const newChosenOptions = {
                    multiple: true,
                    data: getNonconflictingSummerStaffObjects(
                        getConflictingJobsList(ALL_JOBS[currentJobType][row]),
                        currentWeek,
                        currentJobType,
                        WORK_DAYS[col],
                    )
                };
                this.setCellMeta(row, col, 'chosenOptions', newChosenOptions);
            }
        }

        // // update the unused names list every time the user makes a change to the table
        // unusedNames = getUnusedNames(currentWeek, currentJobType);
        // let colSource;
        // // skip over the column with the job names
        // for (let dayIndex = 0; dayIndex < WORK_DAYS.length; dayIndex++) {
        //     colSource = unusedNames[WORK_DAYS[dayIndex]];
        //     colSource.unshift(DEFAULT_SS_NAME);
        //     for (let row = 0; row < ALL_JOBS[currentJobType].length; row++) {
        //         // update the source to use the filtered list of names
        //         this.setCellMeta(row, dayIndex, 'source', colSource);
        //     }
        // }

        warning(""); // reset the error message after a change

        // check for the warning message for more than two forklift jobs in the current week.
        for (summerStaff of SS_CHOSEN_NAMES) {
            for (day of WORK_DAYS) {
                if (countForkliftJobs(currentWeek, day, summerStaff) > 2) {
                    warning(`Warning: ${summerStaff.label} scheduled for more than two forklift jobs on ${day}`);
                }
            }
        }
    }
});

loadDataFromServer();

// make the weeks spinner
const spinner = new ISpin(spinnerElement, {
    min: 1,
    max: NUMBER_OF_WEEKS,
    onChange: () => {
        // off by one because the first week is [0] internally
        currentWeek = spinner.value - 1;
        resetTable();
        localStorage.setItem("lastCurrentWeek", currentWeek);
    }
});

spinner.value = currentWeek + 1;

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
    // save to local storage
    localStorage.setItem("lastCurrentJobType", currentJobType);
};

// set initial value
switch (currentJobType) {
    case 0: jobTypeElement.innerHTML = 'Field'; break;
    case 1: jobTypeElement.innerHTML = 'Plant'; break;
    case 2: jobTypeElement.innerHTML = 'Cleanup'; break;
}

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