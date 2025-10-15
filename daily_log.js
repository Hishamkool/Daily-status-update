
// allow pasting time to input type time
function allowPasting(event) {
    // prevent browsers ingoring the input    
    event.preventDefault();
    const paste = (event.clipboardData || window.clipboardData).getData('text');
    const match = paste.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/);
    if (match) {

        let partsOfInput = paste.split(':');
        if (partsOfInput[0].length === 1) {
            //if hour is single digit then adding 0 before
            partsOfInput[0] = '0' + partsOfInput[0];
        }
        if (partsOfInput[1].length === 2) {
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



// function to accept todays stats
function todays_data_submit() {
   /*  const dailyLogs = JSON.parse(localStorage.getItem('dailyLogs')) || [];
    const formData = new FormData(todaysStatsForm);
    const fromEntries = fromEntries(formData.entries());
    if (dailyLogs.date == fromEntries.date) {
        alert("Do you want to overight the data for the date ", fromEntries.date);

    } */

}



/* // assigning the funciton as a global variable to access outside of the domcontent loaded
window.showOutput = showOutput; */
// submit function for todays stats
todaysStatsForm.addEventListener("submit", function (event) {
    console.log("todays submit button clicked");

    event.preventDefault();

    // approach one to get json objects for current form data but the data handling might be hard and stroring mutiple objects also can be hard 

    /* const TformData = new FormData(todaysStatsForm);
    const TformObj = Object.fromEntries(TformData.entries());
    const TJsonString = JSON.stringify(TformObj);
    console.log("json string:", TJsonString);
    const TjsonObj = JSON.parse(TJsonString);
    console.log("Json object :", TjsonObj); */

    // ===========================================

    let dailyLogs = JSON.parse(localStorage.getItem('dailyLogs')) || [];
    let count = dailyLogs.length + 1;
    console.log("all stats: ", dailyLogs);
    const entry = {
        sl_no: count,
        date: document.getElementById("todays-entry-date").value,
        Focus_time: document.getElementById("todays-focus-time").value,
        Code_time: document.getElementById("todays-ct").value,
        Active_code_time: document.getElementById("todays-act").value,
        HTML: Number(document.getElementById("todays-html").value),
        CSS: Number(document.getElementById("todays-css").value),
        JavaScript: Number(document.getElementById("todays-js").value),
        React: Number(document.getElementById("todays-react").value)
    };
    console.log("todays stats :", entry);

    dailyLogs.push(entry);
    localStorage.setItem('dailyLogs', JSON.stringify(dailyLogs));
    count++;
    showOutput();
});

// showing todays stats in outputbox
function showOutput() {
    const logs = JSON.parse(localStorage.getItem('dailyLogs')) || [];
    outputFile.textContent = JSON.stringify(logs, null, 2);
};







