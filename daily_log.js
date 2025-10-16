
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
        else if (partsOfInput[1].length === 2 && partsOfInput.length === 2) {
       
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

const outputFile = document.querySelector(".output-file");
let dailyLogs = getDailyLogs();
let previousTotals = getPreviousTotal();

// function to get the stored previous totals
function getPreviousTotal() {
    return JSON.parse(localStorage.getItem("previousTotal")) || [];
}
// funtion to get the stored daily log file
function getDailyLogs() {
    return JSON.parse(localStorage.getItem('dailyLogs')) || [];
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

        date: document.getElementById("todays-entry-date").value,
        Focus_time: document.getElementById("todays-focus-time").value,
        Code_time: document.getElementById("todays-ct").value,
        Active_code_time: document.getElementById("todays-act").value,
        HTML: Number(document.getElementById("todays-html").value),
        CSS: Number(document.getElementById("todays-css").value),
        JavaScript: Number(document.getElementById("todays-js").value),
        React: Number(document.getElementById("todays-react").value)
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
});
// function to replace todays data
function replaceData(existingIndex, entry) {
    dailyLogs[existingIndex] = entry;
    resetIndex();
    localStorage.setItem('dailyLogs', JSON.stringify(dailyLogs));
    showOutput();


};
// function to add todays data
function addData(entry) {
    dailyLogs.push(entry);
    resetIndex();
    localStorage.setItem('dailyLogs', JSON.stringify(dailyLogs));

    showOutput();
};

// function to reset serial number for the objects 
function resetIndex() {
    dailyLogs.forEach((item, index) => {
        item.sl_no = index + 1;
    });

}
// showing todays stats in outputbox
function showOutput() {
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
        showOutput();
    } else {
        return;
    }
};



/* _________________working of previous total form_________________________________________________ */
const previousTotalsForm = document.getElementById("previous-total-form");

previousTotalsForm.addEventListener("submit", (event) => {
    event.preventDefault();

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