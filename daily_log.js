
/* variables */
/* storage keys for local storage */
const storage_key_daily_log = 'dailyLogs';
const storage_key_daily_logs_sum = 'dailyLogsSum';
const storage_key_previous_total_input = 'previousTotalObj';
const storage_key_previous_plus_daily = 'previousPlusDaily';
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
/* output */
const outputFile = document.querySelector(".output-file");
const dailyStatsSum = document.querySelector(".daily-stats-sum");
const previousOutput = document.querySelector(".previous-output");
const previousPlusDailyStats = document.querySelector(".previous-plus-dailystats");
/* get stats */
let dailyLogs = getDailyLogs();





/* INITIAL loading functions  */
setTodaysTotalLOCD();
showStats();




// funtion to get the stored daily log file
function getDailyLogs() {
    return JSON.parse(localStorage.getItem(storage_key_daily_log)) || [];
}



// even listners for total lines of code as user typeinput 
[todaysHTML, todaysCSS, todaysJS, todaysReact, totalHtml, totalCss, totalJS, totalReact].forEach(input => {
    input.addEventListener("input", setTodaysTotalLOCD);
});

// function to add and set todays total lines of code for todays entry
function setTodaysTotalLOCD() {
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
todaysStatsForm.addEventListener("submit", function (event) {
    console.log("todays submit button clicked");
    event.preventDefault();
    // if incase the variable is not updated when clearing the storage
    dailyLogs = getDailyLogs();
    const submit_date = document.getElementById("todays-entry-date").value;
    const existingIndex = dailyLogs.findIndex(item => item.date === submit_date);
    console.log("matched :", existingIndex);

    let daily_logs_input_obj = {
        date: todaysDate.value,
        Focus_time: todaysFocus.value || "00:00:00",
        Code_time: todaysCodeTime.value || "00:00:00",
        Active_code_time: todaysActiveCodeTime.value || "00:00:00",
        HTML: Number(todaysHTML.value) || 0,
        CSS: Number(todaysCSS.value) || 0,
        JavaScript: Number(todaysJS.value) || 0,
        React: Number(todaysReact.value) || 0,
        Total: todaysTotalLoc.value,
    };


    // id date matches with output (prestored values)
    if (existingIndex !== -1) {
        const replace = confirm(`Data for the ${submit_date} is already added, Do you want to replace ? `);
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
    // remove this [debug] - to set random numbers to the lines of code
    setRandomValuesToLinesOfCode();
    // function call to calculate the dailyLogsTotal
    dailyLogsTotal();
    showDailyStatsSum();


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


    setTodaysTotalLOCD();
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
    const logs = getDailyLogs();
    if (logs.length == 0) {
        outputFile.style.textAlign = "center";
        outputFile.textContent = 'Daily Stats Empty';
    } else {
        outputFile.style.textAlign = "start";
        outputFile.textContent = JSON.stringify(logs, null, 2);
    }
    console.log("DailyStats:", logs);
};

/* OUTPUT FIELD BUTTONS */
// function to display Output
function showStats() {
    showDailyStats();
    showDailyStatsSum();
    showPreviousTotal();
    showPreviousTotalSum();

}
// function to delete daily stats from the local storage
function clearDailyStats() {
    const deleteAllEntries = confirm("Do you want to clear all your saved entries? CANNOT BE UNDONE !")
    if (deleteAllEntries) {
        dailyLogs = [];
        localStorage.removeItem(storage_key_daily_log);
        localStorage.removeItem(storage_key_daily_logs_sum);

        console.log("cleared dailyLogs : ", getDailyLogs());
        console.log("cleared dailyLogs sum : ", getDailyLogsSum());
        showStats();
    } else {
        return;
    }
};
// function to delete previus stats from the local storage
function clearPreviousTotal() {
    const deletePreviousTotals = confirm("Do you want to delete previous totals? Cannot be undone!");
    if (deletePreviousTotals) {
        localStorage.removeItem(storage_key_previous_total_input);
        console.log("cleared PreviousTotal:", fetchPreviousTotal());
        showStats();
    } else {
        return;
    }
};


/* _________________working of previous total form_________________________________________________ */

// function to add all the values of previous inputs or daily stats
function dailyLogsTotal() {
    // calculating total lines of code from daily stats
    const sumDailyStats = dailyLogs.reduce((acc, currnt) => {
        if (!acc.latestDate || new Date(currnt.date) > new Date(acc.latestDate)) {
            acc.latestDate = currnt.date;
        }
        acc.focus += time2Seconds(currnt.Focus_time);
        acc.codetime += time2Seconds(currnt.Code_time);
        acc.activeCT += time2Seconds(currnt.Active_code_time);
        acc.html += currnt.HTML || 0;
        acc.css += currnt.CSS || 0;
        acc.js += currnt.JavaScript || 0;
        acc.react += currnt.React || 0;
        acc.previousTotal += currnt.Total || 0;
        return acc;
    }, { latestDate: null, focus: 0, codetime: 0, activeCT: 0, html: 0, css: 0, js: 0, react: 0, previousTotal: 0 });


    let daily_logs_total_obj = {
        LatestDate: sumDailyStats.latestDate,
        FOCUS: secondsToHMS(sumDailyStats.focus),
        CODE_TIME: secondsToHMS(sumDailyStats.codetime),
        ACTIVE_CODE_TIME: secondsToHMS(sumDailyStats.activeCT),
        HTML: sumDailyStats.html,
        CSS: sumDailyStats.css,
        JS: sumDailyStats.js,
        REACT: sumDailyStats.react,
        PreviousTotal: sumDailyStats.previousTotal,
    }

    // console.log("daily logs object:", dailyLogTotalObj);
    localStorage.setItem(storage_key_daily_logs_sum, JSON.stringify(daily_logs_total_obj));
    console.log("DailyLogs:");
    console.log(JSON.parse(localStorage.getItem(storage_key_daily_logs_sum)));
    // adding dailylogs total with previous total input form values
    add_dailyStats_PreviousTotal();
    showStats();
};


// funciton to convert time to seconds
function time2Seconds(curr) {
    const value = curr.split(":").map(Number);
    const hours = Math.floor(value[0] * 60 * 60);
    const min = Math.floor(value[1] * 60);
    const sec = Math.floor(value[2]);
    const totalseconds = hours + min + sec;
    return totalseconds;
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
    // console.log("seconds to hh:mm:ss", result);
    return result;
}
// function to get the stored daily log sum
function getDailyLogsSum() {
    return JSON.parse(localStorage.getItem(storage_key_daily_logs_sum)) || [];
}

// function to display sum of dailyLogsSum
function showDailyStatsSum() {
    let dailySum = getDailyLogsSum();
    if (dailySum.length == 0) {
        dailyStatsSum.style.textAlign = "center";
        dailyStatsSum.textContent = 'Daily Stats Sum Empty';

    } else {
        dailyStatsSum.style.textAlign = "start";
        dailyStatsSum.textContent = JSON.stringify(dailySum, null, 2);
    }
    console.log("DailyStatsSum:", dailySum);

}

// function to add the previous total entries into localstorage
previousTotalsForm.addEventListener("submit", (event) => {
    console.log("previous total submit button clicked");

    event.preventDefault();
    dailyLogsTotal();
    // object for the previous total input fields
    let previous_total_inputs_obj = {
        date: previousDate.value,
        total_focus: totalFocus.value || "00:00:00",
        total_CT: totalCodeTime.value || "00:00:00",
        total_ACT: totalActiveCodeTime.value || "00:00:00",
        HTML: Number(totalHtml.value) || 0,
        CSS: Number(totalCss.value) || 0,
        JS: Number(totalJS.value) || 0,
        REACT: Number(totalReact.value) || 0,
    };


    localStorage.setItem(storage_key_previous_total_input, JSON.stringify(previous_total_inputs_obj));
    let storedPreviousTotal = localStorage.getItem(storage_key_previous_total_input);
    console.log("stored PreviousTotal:", JSON.parse(storedPreviousTotal));

    add_dailyStats_PreviousTotal();
    showStats();
});
// function to add previous totals input and daily logs sum
function add_dailyStats_PreviousTotal() {
    let dailyLogsSum = getDailyLogsSum();
    let previousTotal = fetchPreviousTotal();


    let previous_plus_daily_obj = {
        date: dailyLogsSum.LatestDate,
        focus: secondsToHMS(time2Seconds(previousTotal.total_focus) +
            time2Seconds(dailyLogsSum.FOCUS)),
        code_time: secondsToHMS(time2Seconds(previousTotal.total_CT) + time2Seconds(dailyLogsSum.CODE_TIME)),
        active_CT: secondsToHMS(time2Seconds(previousTotal.total_ACT) + time2Seconds(dailyLogsSum.ACTIVE_CODE_TIME)),
        html: previousTotal.HTML + dailyLogsSum.HTML,
        css: previousTotal.CSS + dailyLogsSum.CSS,
        js: previousTotal.JS + dailyLogsSum.JS,
        react: previousTotal.REACT + dailyLogsSum.REACT,

    };
    localStorage.setItem(storage_key_previous_plus_daily, JSON.stringify(previous_plus_daily_obj));
    let st_previousPlusDaily = localStorage.getItem(storage_key_previous_plus_daily);
    console.log("PreviousTotal + DailyLogSum:", st_previousPlusDaily);
    showPreviousTotalSum();
}
// function to retrieve the sum of daily logs plus previous total input values 
function fetchPreviousTotalSum() {
    return JSON.parse(localStorage.getItem(storage_key_previous_plus_daily)) || [];
}

// function fetch previous total 
function fetchPreviousTotal() {
    return JSON.parse(localStorage.getItem(storage_key_previous_total_input))
        ||
    {
        total_focus: "00:00:00",
        total_CT: "00:00:00",
        total_ACT: "00:00:00",
        HTML: 0,
        CSS: 0,
        JS: 0,
        REACT: 0,
    };
}

// function display previous total 
function showPreviousTotal() {
    let previousTotals = fetchPreviousTotal();
    let value = JSON.stringify(previousTotals, null, 2);
    if (previousTotals.length == 0) {
        previousOutput.style.textAlign = "center";
        previousOutput.textContent = "Previous Stats Empty";
    } else {
        previousOutput.style.textAlign = "start";
        previousOutput.textContent = value;
    }
    console.log("PreviousTotal:", previousTotals);
}
// function display previous total 
function showPreviousTotalSum() {
    let previousTotalSum = fetchPreviousTotalSum();
    let value = JSON.stringify(previousTotalSum, null, 2);
    if (previousTotalSum.length == 0) {
        previousPlusDailyStats.style.textAlign = "center";
        previousPlusDailyStats.textContent = "Previous Sum Stats Empty";
    } else {
        previousPlusDailyStats.style.textAlign = "start";
        previousPlusDailyStats.textContent = value;
    }
    console.log("PreviousTotalSum:", previousTotalSum);
}
/* // general outputFormt for stats
function showOutput(arrayy, element) {
    let value = JSON.stringify(arrayy, null, 2);
    if (arrayy.length == 0) {
        arrayy.style.textAlign = "center";
        element.textContent = `${element} is Empty`;
    } else {
        element.textContent = value;
    }
    console.log(element);
    console.log(`${JSON.stringify(arrayy)}`);
} */

const allPreviousInputs = document.querySelectorAll(".previous-input-time");
const previousTimeFormat = /^([0-9]+):([0-5][0-9])(:[0-5][0-9])?$/;
allPreviousInputs.forEach((input) => {
    input.addEventListener("input", (event) => {
        const value = input.value.trim();

        if (/[^0-9:]/.test(value)) {
            input.setCustomValidity("only nymbers and ':' are allowed (eg 36:12:14 )");
            input.reportValidity();
        }
        else if (validateTime(value)) {
            console.log("input ok");
            input.style.borderColor = 'green';
            input.setCustomValidity("");

        } else if ((value).includes(':')) {
            input.style.borderColor = 'red';
            console.log("input format error");
            input.setCustomValidity("Use this format HH:MM:SS or HH:MM");
            input.reportValidity();
        } else {
            input.style.borderColor = "";
            input.setCustomValidity("");
        }
    });
});

// validate time format for previous input
function validateTime(value) {
    return previousTimeFormat.test(value);
}

// allow pasting time to input type time
function allowPasting(event) {
    // prevent browsers ingoring the input    
    event.preventDefault();
    const paste = (event.clipboardData || window.clipboardData).getData('text');
    const pastedWithoutSpaces = paste.replace(/\s/g, "");
    console.log("clipboard data :", pastedWithoutSpaces);

    const match = pastedWithoutSpaces.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/);
    if (match) {

        let partsOfInput = pastedWithoutSpaces.split(':');
        console.log("parts of input length:", partsOfInput.length);
        if (partsOfInput[0].length === 1) {
            //if hour is single digit then adding 0 before
            partsOfInput[0] = '0' + partsOfInput[0];
        }
        if (partsOfInput.length === 2) {

            // if time is hh:mm then adding 00 as seconds
            partsOfInput.push('00');
        }
        event.target.value = partsOfInput.join(':');

    } else {
        event.target.setCustomValidity("Paste time as HH:MM or HH:MM:SS");
        event.target.reportValidity();
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

function allowCopying(event) {
    event.preventDefault();
    const input = event.target.value.trim();

    if (!input) {
        console.log("Nothing to copy");
        return;
    } else {
        navigator.clipboard.writeText(input)
        console.log("copied to clipboard:", input);
    }
}

document.querySelectorAll('#todays-data-form input[type="time"]').forEach(input => {
    input.addEventListener("copy", allowCopying);
});

// function to print all the values in the localStorage
function localStorageData() {
    for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        const value = localStorage.getItem(key);
        console.log(`${key}:${value}`);
    }
}
/* Conditions
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