
// allow pasting time to input type time
function allowPasting(event) {
    // prevent browsers ingoring the input    
    event.preventDefault();
    const paste = (event.clipboardData || window.clipboardData).getData('text');
    console.log("clipboard data :", paste);
    const match = paste.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/);
    if (match) {

        let partsOfInput = paste.split(':');
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
/* variables */
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

const outputFile = document.querySelector(".output-file");
let dailyLogs = getDailyLogs();
let previousTotals = getPreviousTotal();

/* functions to execute as page loads  */
showDailyStats();
setTodaysTotalLOCD();

// function to get the stored previous totals
function getPreviousTotal() {
    return JSON.parse(localStorage.getItem("previousTotal")) || [];
}
// funtion to get the stored daily log file
function getDailyLogs() {
    return JSON.parse(localStorage.getItem('dailyLogs')) || [];
}

// even listners for total lines of code as user typeinput 
[todaysHTML, todaysCSS, todaysJS, todaysReact].forEach(input => {
    input.addEventListener("input", setTodaysTotalLOCD);
});

// function to add and set todays total lines of code
function setTodaysTotalLOCD() {
    let total = (Number(todaysHTML.value) || 0) + (Number(todaysCSS.value) || 0) + (Number(todaysJS.value) || 0) + (Number(todaysReact.value) || 0);
    console.log("total count :", total);
    todaysTotalLoc.value = total;
    todaysTotalLoc.textContent = total;
}

// sumbit event listner on todays stats
todaysStatsForm.addEventListener("submit", function (event) {
    console.log("todays submit button clicked");
    event.preventDefault();
    // if incase the variable is not updated when clearing the storage
    dailyLogs = getDailyLogs();
    const submit_date = document.getElementById("todays-entry-date").value;
    const existingIndex = dailyLogs.findIndex(item => item.date === submit_date);
    console.log("matched :", existingIndex);

    const entry = {
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
            replaceData(existingIndex, entry);
        } else {
            return;
        }
    } else {
        // i.e., exsisting index == -1 means(no entrt found) its a new entry then add
        addData(entry);
    }
    // remove this [debug]
    setRandomValuesToLinesOfCode();

});


// function to replace todays data
function replaceData(existingIndex, entry) {
    dailyLogs[existingIndex] = entry;
    resetIndex();
    localStorage.setItem('dailyLogs', JSON.stringify(dailyLogs));
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
    localStorage.setItem('dailyLogs', JSON.stringify(dailyLogs));

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
        outputFile.classList.add("no-data");
        outputFile.textContent = 'Daily Stats Empty';
    } else {
        outputFile.classList.remove("no-data");
        outputFile.textContent = JSON.stringify(logs, null, 2);
    }
    // outputFile.textContent = logs.length === 0 ? "No data found" : JSON.stringify(logs, null, 2);
    console.log("all stats:", logs);
};



function clearLoacalStorage() {
    const deleteAllEntries = confirm("Do you want to clear all your saved entries? CANNOT BE UNDONE !")
    if (deleteAllEntries) {
        window.localStorage.removeItem('dailyLogs');
        console.log("cleared dailyLogs : ", getDailyLogs());
        getDailyLogs();
        showDailyStats();
    } else {
        return;
    }
};



/* _________________working of previous total form_________________________________________________ */
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

const previousEntry = {
    date: dailyLogs,
    total_focus: totalFocus,
    total_CT: totalCodeTime,
    total_ACT: totalActiveCodeTime,
    HTML: totalHtml,
    CSS: totalCss,
    JS: totalJS,
    REACT: totalReact,
}
// function to add all the values of previous inputs to the previous entry
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


    const dailyLogTotalObj = {
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

    console.log("daily logs object:", dailyLogTotalObj);
    localStorage.setItem('dailyLogsSum', JSON.stringify(dailyLogTotalObj));
    console.log("stored daily logs:");
    console.log(JSON.parse(localStorage.getItem('dailyLogsSum')));
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
    console.log("seconds to hh:mm:ss", result);
    return result;
}
// function to add the previous entry into localstorage
previousTotalsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    dailyLogsTotal();
});

const allPreviousInputs = document.querySelectorAll(".previous-input-time");
const previousTimeFormat = /^([0-9]+):([0-5][0-9])(:[0-5][0-9])?$/;
allPreviousInputs.forEach((input) => {
    input.addEventListener("input", (event) => {

        if (validateTime(input.value)) {
            console.log("input ok");
            input.style.borderColor = 'green';
            event.target.setCustomValidity("");

        } else {
            input.style.borderColor = 'red';
            console.log("input format error");
            event.target.setCustomValidity("Use this format HH:MM:SS or HH:MM");
            event.target.reportValidity();
        }

    });
});

// validate time format for previous input
function validateTime(value) {
    return previousTimeFormat.test(value);
}