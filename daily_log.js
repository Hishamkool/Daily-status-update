
/* variables */
/* debug status */
const debug = true;
// make sure to remove novalidate from forms in the html
/* storage keys for local storage */
const storage_key_daily_log = 'dailyLogs';
const storage_key_daily_logs_sum = 'dailyLogsSum';
const storage_key_previous_total_input = 'previousTotalObj';
const storage_key_previous_plus_daily = 'previousPlusDaily';

/* CONSTANT KEY NAMES FOR OBJECTS */
// ====== DAILY STATS KEYS ======
const DATE = "date";
const FOCUS_TIME = "focus_time";
const CODE_TIME = "code_time";
const ACTIVE_CODE_TIME = "active_code_time";
const HTML = "html";
const KEY_CSS = "css";
const JAVASCRIPT = "javascript";
const REACT = "react";
const DAILY_TOTAL = "daily_total";
const SL_NO = "sl_no";

// ====== DAILY STATS SUM ======
const LATEST_DATE = "latest_date";

// ====== PREVIOUS TOTALS & ALL-TIME KEYS ======
const TOTAL_FOCUS = "total_focus";
const TOTAL_CODE_TIME = "total_code_time";
const TOTAL_ACTIVE_CODE_TIME = "total_active_code_time";
const TOTAL_HTML = "total_html";
const TOTAL_CSS = "total_css";
const TOTAL_JS = "total_js";
const TOTAL_REACT = "total_react";
const ALL_TIME_TOTAL = "all_time_total";


/* todays stats variables */
const todaysStatsForm = document.getElementById("todays-data-form");
const todaysDate = document.getElementById("todays-entry-date");
const todaysFocus = document.getElementById("todays-focus-time");
const todaysCodeTime = document.getElementById("todays-ct");
const todaysActiveCodeTime = document.getElementById("todays-act");
const todaysHTML = document.getElementById("todays-html");
const todaysCSS = document.getElementById("todays-css");
const todaysJS = document.getElementById("todays-js");
const todaysReact = document.getElementById("todays-react");
const todaysTotalLoc = document.getElementById("todays-total-loc");
/* previous stats variables */
const previousTotalsForm = document.getElementById("previous-total-form");
const previousDate = document.getElementById("previous-total-date");
const totalFocus = document.getElementById("previous-focus-time");
const totalCodeTime = document.getElementById("previous-ct");
const totalActiveCodeTime = document.getElementById("previous-act");
const totalHtml = document.getElementById("previous-html");
const totalCss = document.getElementById("previous-css");
const totalJS = document.getElementById("previous-js");
const totalReact = document.getElementById("previous-react");
const totalLOCAllTime = document.getElementById("previous-total-alltimeloc");
/* Copy stats to clipboard */
const copyStatsBtn = document.getElementById("copy_stats");
/* export secion */
const downloadCsv = document.getElementById("download-csv");
const downloadExcel = document.getElementById("download-excel");
/* output */
const outputFile = document.querySelector(".output-file");
const dailyStatsSum = document.querySelector(".daily-stats-sum");
const previousOutput = document.querySelector(".previous-output");
const previousPlusDailyStats = document.querySelector(".previous-plus-dailystats");
/* get stats */
let dailyLogs = fetchDailyLogs();
/* Popups */
const confirmationPopup = document.getElementById("ConfirmationBox");
const confirmYes = document.getElementById("confirm-yes");
const confirmNo = document.getElementById("confirm-no");
const confirmMessage = document.getElementById("confirm-message");
const confirmNote = document.getElementById("confirm-note");
/* snackbar */
const snackBar = document.getElementById("snack-bar");
const snackBarData = document.getElementById("snack-bar-data");
/* INITIAL loading functions  */
showStats();
calculateTotalLinesOfCode();
setPreviousInputsValues();




// funtion to get the stored daily log file
function fetchDailyLogs() {
    return JSON.parse(localStorage.getItem(storage_key_daily_log)) || [];
}



// even listners for total lines of code as user inputs data 
[todaysHTML, todaysCSS, todaysJS, todaysReact, totalHtml, totalCss, totalJS, totalReact].forEach(input => {
    input.addEventListener("input", calculateTotalLinesOfCode);
});

// function to add and set todays total lines of code for todays entry and previous total
function calculateTotalLinesOfCode() {
    // todays fields total
    let todaysTotal = (Number(todaysHTML.value) || 0) + (Number(todaysCSS.value) || 0) + (Number(todaysJS.value) || 0) + (Number(todaysReact.value) || 0);
    todaysTotalLoc.value = todaysTotal;
    todaysTotalLoc.textContent = todaysTotal;
    // previous fields total
    let previousTotal = (Number(totalHtml.value) || 0) + (Number(totalCss.value) || 0) + (Number(totalJS.value) || 0) + (Number(totalReact.value) || 0);
    totalLOCAllTime.value = previousTotal;
    totalLOCAllTime.textContent = previousTotal;
}

// sumbit event listner on todays stats - todays submit
todaysStatsForm.addEventListener("submit", async function (event) {

    event.preventDefault();
    dailyLogs = fetchDailyLogs();
    const submit_date = document.getElementById("todays-entry-date").value;
    const existingIndex = dailyLogs.findIndex(item => item.date === submit_date);
    debug && console.log("matched :", existingIndex);
    // showing submit confirmation if its not a existing data 
    const sure2submit = existingIndex === -1 ? await toggleConfiramtionPopup("Submit Data ?", false) : true;
    if (sure2submit) {

        let daily_logs_input_obj = {
            [DATE]: todaysDate.value,
            [FOCUS_TIME]: todaysFocus.value || "00:00:00",
            [CODE_TIME]: todaysCodeTime.value || "00:00:00",
            [ACTIVE_CODE_TIME]: todaysActiveCodeTime.value || "00:00:00",
            [HTML]: Number(todaysHTML.value) || 0,
            [KEY_CSS]: Number(todaysCSS.value) || 0,
            [JAVASCRIPT]: Number(todaysJS.value) || 0,
            [REACT]: Number(todaysReact.value) || 0,
            [DAILY_TOTAL]: todaysTotalLoc.value,
        };


        // id date matches with output (prestored values)
        if (existingIndex !== -1) {
            const replace = await toggleConfiramtionPopup(`Data for ${submit_date} is already added, Do you want to replace ?`);
            //    if use wants to replace the already available data 
            if (replace) {
                //functinality to replace the todays data
                replaceData(existingIndex, daily_logs_input_obj);
            } else {
                return;
            }
        } else {
            // i.e., exsisting index == -1 means(no entrt found) its a new entry then add
            addData(daily_logs_input_obj);
        }
        // remove this [debug] - to set random numbers to the lines of code for testing
        debug && setRandomValuesToLinesOfCode();
        // function call to calculate the dailyLogsTotal
        calculateDailyLogsTotal();
        showDailyLogsTotal();
        showSnackBar("Data Set", undefined, 1000);
    }





});


// function to replace todays data for a particular date
function replaceData(existingIndex, entry) {
    dailyLogs[existingIndex] = entry;
    resetIndex();
    localStorage.setItem(storage_key_daily_log, JSON.stringify(dailyLogs));
    showDailyStats();

};

/* [debug] remove this function ------------------------ */
function setRandomValuesToLinesOfCode() {
    const html = document.getElementById("todays-html");
    const css = document.getElementById("todays-css");
    const react = document.getElementById("todays-js");
    const js = document.getElementById("todays-react");

    html.value = Math.floor(Math.random() * (600 - 50 + 1)) + 50;
    css.value = Math.floor(Math.random() * (600 - 50 + 1)) + 50;
    js.value = Math.floor(Math.random() * (600 - 50 + 1)) + 50;
    react.value = Math.floor(Math.random() * (600 - 50 + 1)) + 50;


    calculateTotalLinesOfCode();
}
/* -------------------------------------------------------- */

// function to add todays data
function addData(entry) {
    dailyLogs.push(entry);
    resetIndex();
    localStorage.setItem(storage_key_daily_log, JSON.stringify(dailyLogs));

    showDailyStats();
};

// function to reset serial number for the objects 
function resetIndex() {
    dailyLogs.forEach((item, index) => {
        item.sl_no = index + 1;
    });

}
// showing todays stats in outputbox
function showDailyStats() {
    const logs = fetchDailyLogs();
    if (logs.length == 0) {
        outputFile.style.textAlign = "center";
        outputFile.textContent = 'Daily Stats Empty';
    } else {
        outputFile.style.textAlign = "start";
        outputFile.textContent = JSON.stringify(logs, null, 2);
    }
    debug && console.log("DailyStats:", logs);
};

/* OUTPUT FIELD BUTTONS */
// function to display Output
function showStats() {
    showDailyStats();
    showDailyLogsTotal();
    showPreviousInput();
    showPreviousPlusDaily();

}

/* Delete data buttons */
// function to delete daily stats from the local storage
async function clearDailyStats(deleteAllEntries) {
    if (!deleteAllEntries) {
        // if there is no passed bool we show popup
        deleteAllEntries = await toggleConfiramtionPopup("Delete all daily stats?");
    }
    if (deleteAllEntries) {
        dailyLogs = [];
        localStorage.removeItem(storage_key_daily_log);
        localStorage.removeItem(storage_key_daily_logs_sum);

        debug && console.log("cleared dailyLogs : ", fetchDailyLogs());
        debug && console.log("cleared dailyLogs sum : ", fetchDailyLogsSum());
        showStats();
    } else {
        showSnackBar(`Could NOT Delete!\n Parameter not passed: ${deleteAllEntries}`, true);
        return;
    }
};
// function to delete previus stats from the local storage
async function clearPreviousTotal() {
    const deletePreviousTotals = await toggleConfiramtionPopup("Do you want to delete previous totals?");
    if (deletePreviousTotals) {
        localStorage.removeItem(storage_key_previous_plus_daily);
        debug && console.log("cleared PreviousTotalSum:", fetchPreviousPlusDaily());
        showStats();
    } else {
        return;
    }
};
// function to clear all values in the local storage
window.clearLocalStorage = async function clearLocalStorage() {
    const clear = await toggleConfiramtionPopup("Do you want to reset all the data stored in the browser? ");

    if (clear) {
        localStorage.clear();
        showStats();
        return `local storage cleared successfully : ${showlocalStorageData()}`
    }
}

/* Copying the data in the format of the slack */
function copyDailyLogToClipboard() {
    let selectedDate = document.getElementById("copy-stats-date").value;

    const dailyLogs = fetchDailyLogs();
    const logForTheDate = dailyLogs.find(stats => stats[DATE] === selectedDate);
    if (!dailyLogs || Object.keys(dailyLogs).length === 0) {
        debug && console.log("Daily Logs has not been added");
        showSnackBar("Daily Logs not found", true);
        return;
    } else if (!selectedDate) {
        showSnackBar("Select a date", true);
    } else if (!logForTheDate) {
        debug && console.log("Logs for the selected date is missing");
        showSnackBar("logs for selected date is missing", true);
        return;
    } else {
        let previousPlusDaily = fetchPreviousPlusDaily();
        // format time hr , min and sec
        const formatOutputTime = (hms) => {
            if (!hms) {
                return "0hr 0min";
            } else {
                const parts = hms.split(":").map(Number);
                const [h = 0, m = 0, s = 0] = parts;
                if (s == 0) return `${h}hr ${m}min`;
                return `${h}hr ${m}min ${s}sec`;
            }
        };
 

        const StatsForTheDay = `
        Focus    : [${formatOutputTime(logForTheDate[FOCUS_TIME])}] [${formatOutputTime(previousPlusDaily[TOTAL_FOCUS])}]
        CT       : [${formatOutputTime(logForTheDate[CODE_TIME])}] [${formatOutputTime(previousPlusDaily[TOTAL_CODE_TIME])}]
        ACT      : [${formatOutputTime(logForTheDate[ACTIVE_CODE_TIME])}] [${formatOutputTime(previousPlusDaily[TOTAL_ACTIVE_CODE_TIME])}]
        HTML     : [${logForTheDate[HTML] || 0}] [${previousPlusDaily[TOTAL_HTML] || 0}]
        CSS      : [${logForTheDate[KEY_CSS] || 0}] [${previousPlusDaily[TOTAL_CSS] || 0}]
        JS       : [${logForTheDate[JAVASCRIPT] || 0}] [${previousPlusDaily[TOTAL_JS] || 0}]
        React    : [${logForTheDate[REACT] || 0}] [${previousPlusDaily[TOTAL_REACT] || 0}]
        Total    : [${logForTheDate[DAILY_TOTAL]}] [${previousPlusDaily[ALL_TIME_TOTAL]}]
        `;
        // formating the stats to remove the spaces in the starting and ending of the line
        const statsForTheDayFormated = StatsForTheDay.split('\n')
            .map(eachLine => eachLine.trim())
            .filter(eachLine => eachLine)
            .join('\n');
        console.log("Clipboard Data : ", StatsForTheDay);
        console.log("Clipboard Data : ", statsForTheDayFormated);
        navigator.clipboard.writeText(statsForTheDayFormated).then(() => console.log(`stats for ${selectedDate} copied`)).catch((err) => console.log(`error copying data ${err}`));

        showSnackBar(`Stats for ${selectedDate} copied`);
    }


}


/* _________________working of previous total form_________________________________________________ */

// function to add all the values of previous inputs or daily stats
function calculateDailyLogsTotal() {
    // calculating total lines of code from daily stats
    const sumDailyStats = dailyLogs.reduce((acc, currnt) => {
        if (!acc.latestDate || new Date(currnt.date) > new Date(acc.latestDate)) {
            acc.latestDate = currnt.date;
        }
        acc.focus += time2Seconds(currnt[FOCUS_TIME]);
        acc.codetime += time2Seconds(currnt[CODE_TIME]);
        acc.activeCT += time2Seconds(currnt[ACTIVE_CODE_TIME]);
        acc.html += currnt[HTML] || 0;
        acc.css += currnt[KEY_CSS] || 0;
        acc.js += currnt[JAVASCRIPT] || 0;
        acc.react += currnt[REACT] || 0;
        acc.previousTotal += currnt[DAILY_TOTAL] || 0;
        return acc;
    }, { latestDate: null, focus: 0, codetime: 0, activeCT: 0, html: 0, css: 0, js: 0, react: 0, previousTotal: 0 });


    let daily_logs_total_obj = {
        [LATEST_DATE]: sumDailyStats.latestDate,
        [FOCUS_TIME]: secondsToHMS(sumDailyStats.focus),
        [CODE_TIME]: secondsToHMS(sumDailyStats.codetime),
        [ACTIVE_CODE_TIME]: secondsToHMS(sumDailyStats.activeCT),
        [HTML]: sumDailyStats.html,
        [KEY_CSS]: sumDailyStats.css,
        [JAVASCRIPT]: sumDailyStats.js,
        [REACT]: sumDailyStats.react,
        [DAILY_TOTAL]: sumDailyStats.previousTotal,
    }

    // debug && console.log("daily logs object:", dailyLogTotalObj);
    localStorage.setItem(storage_key_daily_logs_sum, JSON.stringify(daily_logs_total_obj));

    // adding dailylogs total with previous total input form values
    add_dailyStatsTotal_and_PreviousInput();
    showStats();
};


// funciton to convert time to seconds
function time2Seconds(curr) {
    if (!curr || typeof curr !== "string") {
        console.log("The value for time conversion is undefined or not a string");
        return 0;
    }
    const [h = 0, m = 0, s = 0] = curr.split(":").map(Number);
    const totalSeconds = (h * 3600) + (m * 60) + s;
    return totalSeconds;
}
//  function to convert seconds to HH:MM:SS
function secondsToHMS(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor((totalSeconds % 3600) % 60);

    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");
    const result = `${hh}:${mm}:${ss}`;
    // debug && console.log("seconds to hh:mm:ss", result);
    return result;
}
// function to get the stored daily log sum
function fetchDailyLogsSum() {
    return JSON.parse(localStorage.getItem(storage_key_daily_logs_sum)) || [];
}

// function to display sum of dailyLogsSum
function showDailyLogsTotal() {
    let dailySum = fetchDailyLogsSum();
    if (dailySum.length == 0) {
        dailyStatsSum.style.textAlign = "center";
        dailyStatsSum.textContent = 'Daily Stats Sum Empty';

    } else {
        dailyStatsSum.style.textAlign = "start";
        dailyStatsSum.textContent = JSON.stringify(dailySum, null, 2);
    }
    debug && console.log("DailyStatsSum:", dailySum);

}

// function to add the previous total entries into localstorage
previousTotalsForm.addEventListener("submit", async (event) => {
    debug && console.log("previous total submit button clicked");

    event.preventDefault();
    const deleteAllDailyLogs = await toggleConfiramtionPopup("Setting previous total would clear all of the saved daily logs and start fresh, do you want to continue?");
    if (deleteAllDailyLogs) {
        await clearDailyStats(deleteAllDailyLogs);
        // object for the previous total input fields
        let previous_total_inputs_obj = {
            [DATE]: previousDate.value,
            [TOTAL_FOCUS]: totalFocus.value || "00:00:00",
            [TOTAL_CODE_TIME]: totalCodeTime.value || "00:00:00",
            [TOTAL_ACTIVE_CODE_TIME]: totalActiveCodeTime.value || "00:00:00",
            [TOTAL_HTML]: Number(totalHtml.value) || 0,
            [TOTAL_CSS]: Number(totalCss.value) || 0,
            [TOTAL_JS]: Number(totalJS.value) || 0,
            [TOTAL_REACT]: Number(totalReact.value) || 0,
        };
        localStorage.setItem(storage_key_previous_total_input, JSON.stringify(previous_total_inputs_obj));
        let storedPreviousTotal = localStorage.getItem(storage_key_previous_total_input);
        /*  debug &&  */console.log("PreviousTotal Input:", JSON.parse(storedPreviousTotal));
        //    put this inside if so that only show send if user accepts delete logs
        showSnackBar("Data Set", undefined, 1000);
    }


    showStats();
    calculateDailyLogsTotal();
    add_dailyStatsTotal_and_PreviousInput();

});
// function to add previous totals input and daily logs sum
function add_dailyStatsTotal_and_PreviousInput() {

    let dailyLogsSum = fetchDailyLogsSum();
    let previousTotal = fetchPreviousInput();

    if (!previousTotal || Object.keys(previousTotal).length === 0) {
        previousTotal =
        {
            [TOTAL_FOCUS]: "00:00:00",
            [TOTAL_CODE_TIME]: "00:00:00",
            [TOTAL_ACTIVE_CODE_TIME]: "00:00:00",
            [TOTAL_HTML]: 0,
            [TOTAL_CSS]: 0,
            [TOTAL_JS]: 0,
            [TOTAL_REACT]: 0,
        };
        localStorage.setItem(storage_key_previous_total_input, JSON.stringify(previousTotal));

    };

    let previous_plus_daily_obj = {
        [DATE]: dailyLogsSum[LATEST_DATE] || previousDate.value,
        [TOTAL_FOCUS]: secondsToHMS(time2Seconds(previousTotal[TOTAL_FOCUS]) +
            time2Seconds(dailyLogsSum[FOCUS_TIME])),
        [TOTAL_CODE_TIME]: secondsToHMS(time2Seconds(previousTotal[TOTAL_CODE_TIME]) + time2Seconds(dailyLogsSum[CODE_TIME])),
        [TOTAL_ACTIVE_CODE_TIME]: secondsToHMS(time2Seconds(previousTotal[TOTAL_ACTIVE_CODE_TIME]) + time2Seconds(dailyLogsSum[ACTIVE_CODE_TIME])),
        [TOTAL_HTML]: previousTotal[TOTAL_HTML] + dailyLogsSum[HTML],
        [TOTAL_CSS]: previousTotal[TOTAL_CSS] + dailyLogsSum[KEY_CSS],
        [TOTAL_JS]: previousTotal[TOTAL_JS] + dailyLogsSum[JAVASCRIPT],
        [TOTAL_REACT]: previousTotal[TOTAL_REACT] + dailyLogsSum[REACT],
        [ALL_TIME_TOTAL]: (previousTotal[TOTAL_HTML] + dailyLogsSum[HTML]) +
            (previousTotal[TOTAL_CSS] + dailyLogsSum[KEY_CSS]) +
            (previousTotal[TOTAL_JS] + dailyLogsSum[JAVASCRIPT]) +
            (previousTotal[TOTAL_REACT] + dailyLogsSum[REACT]),

    };
    localStorage.setItem(storage_key_previous_plus_daily, JSON.stringify(previous_plus_daily_obj));

    //show final previous total in output box
    showPreviousPlusDaily();
    // set final previous total in previous total input box
    setPreviousInputsValues();
}
setPreviousInputsValues();
// function to set the input values at previous total field
function setPreviousInputsValues() {
    let previousPlusDaily = fetchPreviousPlusDaily();
    if (!previousPlusDaily || Object.keys(previousPlusDaily).length == 0) {
        return;
    }
    previousDate.value = previousPlusDaily[DATE] || null;
    totalFocus.value = previousPlusDaily[TOTAL_FOCUS] || '00:00:00';
    totalCodeTime.value = previousPlusDaily[TOTAL_CODE_TIME] || '00:00:00';;
    totalActiveCodeTime.value = previousPlusDaily[TOTAL_ACTIVE_CODE_TIME] || '00:00:00';;
    totalHtml.value = previousPlusDaily[TOTAL_HTML] || 0;
    totalCss.value = previousPlusDaily[TOTAL_CSS] || 0;
    totalJS.value = previousPlusDaily[TOTAL_JS] || 0;
    totalReact.value = previousPlusDaily[TOTAL_REACT] || 0;
    totalLOCAllTime.textContent = previousPlusDaily[TOTAL_HTML] + previousPlusDaily[TOTAL_CSS] + previousPlusDaily[TOTAL_JS] + previousPlusDaily[TOTAL_REACT];

}
// function to retrieve the sum of daily logs plus previous total input values 
function fetchPreviousPlusDaily() {
    let previousPlusDaily = [];
    try {
        let data = localStorage.getItem(storage_key_previous_plus_daily);
        previousPlusDaily = data ? JSON.parse(data) : [];

    } catch (error) {
        previousPlusDaily = [];
    }
    console.log(`PreviousPlusDaily:${previousPlusDaily}`);
    return previousPlusDaily;
}

// function fetch previous total 
function fetchPreviousInput() {
    return JSON.parse(localStorage.getItem(storage_key_previous_total_input))
        || {};

}

// function to display previous total 
function showPreviousInput() {
    let previousTotals = fetchPreviousInput();
    let value = JSON.stringify(previousTotals, null, 2);
    if (previousTotals.length == 0 || Object.keys(previousTotals).length === 0) {
        previousOutput.style.textAlign = "center";
        previousOutput.textContent = "Previous Stats Entry Empty";
    } else {
        previousOutput.style.textAlign = "start";
        previousOutput.textContent = value;
    }
    debug && console.log("PreviousTotal:", previousTotals);
}
// function display previous total sum
function showPreviousPlusDaily() {
    let previousTotalSum = fetchPreviousPlusDaily();
    let value = JSON.stringify(previousTotalSum, null, 2);
    if (previousTotalSum.length == 0) {
        previousPlusDailyStats.style.textAlign = "center";
        previousPlusDailyStats.textContent = "Previous Sum Stats Empty";
    } else {
        previousPlusDailyStats.style.textAlign = "start";
        previousPlusDailyStats.textContent = value;
    }
    debug && console.log("PreviousTotalSum:", previousTotalSum);
}

/* VALIDATIONS */
// previous inputs validations
const allPreviousInputs = document.querySelectorAll(".previous-input-time");
const previousTimeFormat = /^([0-9]+):([0-5][0-9])(:[0-5][0-9])?$/;
allPreviousInputs.forEach((input) => {
    input.addEventListener("input", (event) => {
        const value = input.value.trim();

        if (!value) {
            input.setCustomValidity("");
            input.style.borderColor = '';
            return;
        }
        else if (/[^0-9:]/.test(value)) {
            input.setCustomValidity("only nymbers and ':' are allowed (eg 36:12:14 )");
            input.reportValidity();
        }
        else if (validateTime(value)) {
            debug && console.log("input ok");
            input.style.borderColor = 'green';
            input.setCustomValidity("");

        }
        else if (!value.includes(':') && value !== "") {
            input.setCustomValidity("Time must include ':' (use HH:MM or HH:MM:SS)");
            input.reportValidity();
            input.style.borderColor = 'red';
        }

        else if ((value).includes(':')) {
            input.setCustomValidity("Use this format HH:MM:SS or HH:MM");
            input.reportValidity();
            input.style.borderColor = 'red';
            debug && console.log("input format error");
        } else {
            input.style.borderColor = "";
            input.setCustomValidity("");
        }
    });
});
// todays input validations
// validate time format for previous input
function validateTime(value) {
    return previousTimeFormat.test(value);
}

// allow pasting time to input type time
function allowPasting(event) {
    event.preventDefault();
    event.target.value = "";
    const paste = (event.clipboardData || window.clipboardData).getData('text');
    let pastedWithoutSpaces = paste.replace(/\s/g, "");
    // still not able to paste text from input field have to check why :10:10:10
    pastedWithoutSpaces = pastedWithoutSpaces.replace(/\uFF1A/g, ":")       // replace fullwidth colon with normal colon
        .replace(/\u200B|\u200F/g, ""); // remove invisible unicode chars

    debug && console.log("clipboard data :", pastedWithoutSpaces);
    debug && console.log(`clipboard data : '${pastedWithoutSpaces}'`);

    const match = pastedWithoutSpaces.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/);
    if (match) {
        event.target.setCustomValidity("");
        let partsOfInput = pastedWithoutSpaces.split(':');

        if (partsOfInput[0].length === 1) {
            //if hour is single digit then adding 0 before
            partsOfInput[0] = '0' + partsOfInput[0];
        }
        if (partsOfInput.length === 2) {
            // if time is hh:mm then adding 00 as seconds
            partsOfInput.push('00');
        }
        event.target.value = partsOfInput.join(':');
        showSnackBar("pasted");

    } else {
        event.target.setCustomValidity("Paste time as HH:MM or HH:MM:SS");
        event.target.reportValidity();
        showSnackBar("couldnt paste", true);
    }
}
// validating input while copy pasting into the time input fields
function validateTimeFormat(input) {
    const val = input.value;
    const valid = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(val);
    if (!valid && val !== "") {
        //value not empty to work only when 
        input.setCustomValidity("Enter time as HH:MM or HH:MM:SS");
    } else {
        input.setCustomValidity("");
    }
}
// function to copy data from the input field time
function allowCopying(event) {
    event.preventDefault();
    const input = event.target.value.trim();

    if (!input) {
        debug && console.log("Nothing to copy");
        return;
    } else {
        navigator.clipboard.writeText(input);
        showSnackBar("copied");
        debug && console.log("copied to clipboard:", input);
    }
}

document.querySelectorAll('#todays-data-form input[type="time"]').forEach(input => {
    input.addEventListener("copy", allowCopying);
});

// function to print all the values in the localStorage
window.showlocalStorageData = function showlocalStorageData() {
    for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        const value = localStorage.getItem(key);

        let parsedValue;
        try {
            parsedValue = JSON.parse(value);
        } catch (e) {
            parsedValue = value; // keep as string if not valid JSON
        }
        console.log(`(${key}):`, parsedValue);
    }
};
/* popups */
// function to handle confirmation messages 
// note this is an asysc function so while calling it its an await call else you will always get true
async function toggleConfiramtionPopup(message, shouldDisplyNote = true, anchorElement) {

    return new Promise((resolve) => {
        confirmMessage.textContent = message;
        if (shouldDisplyNote == false) {
            confirmNote.style.display = "none";
        } else {
            confirmNote.style.display = "block";
        }
        const onYes = () => {
            cleanup();
            resolve(true);
        };
        const onNo = () => {
            cleanup();
            resolve(false);
        };
        const cleanup = () => {
            //we use cleanup to remove the event listners so that if user clicks on the smae popupu mutiple times there would be multiple event listeners on the buttons which when fired will execute all the eventlisteners actions one after teh other which might cause data loss or memory loss when the same action is performed multiple times and also lot of memory loss for accumulating the same event listeneres on the for teh same button
            confirmYes.removeEventListener("click", onYes);
            confirmNo.removeEventListener("click", onNo);
            confirmationPopup.hidePopover();
        };
        confirmYes.addEventListener("click", onYes);
        confirmNo.addEventListener("click", onNo);
        // show popover anchored to the elemt if passeed to function
        if (anchorElement) {
            confirmationPopup.showPopover(anchorElement);
        } else {
            confirmationPopup.showPopover();
        }
    });
}

/* SNACKBARS */
function showSnackBar(message, isError = false, duration = 3000) {
    snackBar.textContent = message;
    if (isError == true) {
        snackBar.style.backgroundColor = "red";
        snackBar.style.color = "white";
    } else {
        snackBar.style.backgroundColor = "lightgreen";
        snackBar.style.color = "black";

    }
    snackBar.classList.add("showSnack");
    setTimeout(() => {
        snackBar.classList.remove("showSnack");
    }, duration);
}

/* DOWNLOAD SECTION */
// event listeners to download csv file
downloadCsv.addEventListener("click", () => {
    const dailyLogs = fetchDailyLogs();
    const dailyLogsSum = fetchDailyLogsSum();
    // if we have not stored any daily logs yet
    if (!dailyLogs.length) {
        showSnackBar("No daily Logs found to download", true);
        return;
    }

    const headers = Object.keys(dailyLogs[0]).join(",");
    const rows = dailyLogs.map(rowItems => Object.values(rowItems).join(",")); // mow row is an array
    if (dailyLogsSum && Object.keys(dailyLogsSum).length > 0) {
        // const latestDay = dailyLogsSum.LatestDate ? new Date(dailyLogsSum.LatestDate).getDate() : ""
        const totalObject = [

            "Total",
            dailyLogsSum[FOCUS_TIME],
            dailyLogsSum[CODE_TIME],
            dailyLogsSum[ACTIVE_CODE_TIME],
            dailyLogsSum[HTML],
            dailyLogsSum[KEY_CSS],
            dailyLogsSum[JAVASCRIPT],
            dailyLogsSum[REACT],
            dailyLogsSum[DAILY_TOTAL],
            dailyLogsSum[LATEST_DATE],

        ].join(",");
        rows.push(totalObject);
    }

    // const rows = dailyLogs.map(rowItems => Object.values(rowItems).join(",")).join("\n"); // mow row is a string because of join("\n")
    // const totalRow = Object.values(dailyLogsSum).join(","); // one way of adding totals at the end
    // const csvData = headers + "\n" + rows + "\n" + totalRow;
    const csvData = headers + "\n" + rows.join("\n");


    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" }); // creating a binary object file to store our file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);  // creating a url for our file
    link.download = "dailyLogs.csv"; //naming downld
    link.click();
    showSnackBar("file downloading...", undefined, 1200);
});

downloadExcel.addEventListener("click", () => {
    const dailyLogs = fetchDailyLogs();
    const dailyLogsSum = fetchDailyLogsSum();
    // if we have not stored any daily logs yet
    if (!dailyLogs.length) {
        showSnackBar("No daily Logs found to download", true);
        return;
    }
    // creating a copy for not altering the original file
    const logsForExcel = [...dailyLogs];
    if (dailyLogsSum && Object.keys(dailyLogsSum).length > 0) {

        logsForExcel.push({
            [DATE]: "Total",
            [FOCUS_TIME]: dailyLogsSum[FOCUS_TIME],
            [CODE_TIME]: dailyLogsSum[CODE_TIME],
            [ACTIVE_CODE_TIME]: dailyLogsSum[ACTIVE_CODE_TIME],
            [HTML]: dailyLogsSum[HTML],
            [KEY_CSS]: dailyLogsSum[KEY_CSS],
            [JAVASCRIPT]: dailyLogsSum[JAVASCRIPT],
            [REACT]: dailyLogsSum[REACT],
            [DAILY_TOTAL]: dailyLogsSum[DAILY_TOTAL],
            [SL_NO]: dailyLogsSum[LATEST_DATE]
        });
    }


    // created a worksheed like sheet 1
    const worksheet = XLSX.utils.json_to_sheet(logsForExcel);
    // created a new workbook or excel file
    const workbook = XLSX.utils.book_new();
    // now i need to add the data to the file
    XLSX.utils.book_append_sheet(workbook, worksheet, "All daily logs");
    // name and download it
    XLSX.writeFile(workbook, "DailyStats.xlsx");
    showSnackBar("file downloading...", undefined, 1200);
});


/* Conditions or work flow
    a. he dosent have previous records :
        he starts fresh by entering todays stats it gets summed to daily stats sum 
        previous total = 0+ dailystatssum;
    b. He has daily previous records :
        he enters previous records , then enteres todays stas
        previous total = previous total + daily stats.
        1. He modified previous totals in between :
            daily logs should be cleared(else there will be a missmatch between previous total and daily stats)
            previous totals shoudl be updated 
            previous total = previous total + daily stats.        
*/