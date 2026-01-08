/* variables */
/* debug status */
const debug = true;
// make sure to remove novalidate from forms in the html
/* storage keys for local storage */
const storage_key_daily_log = "dailyLogs";
const storage_key_daily_logs_sum = "dailyLogsSum";
const storage_key_previous_total_input = "previousTotalObj";
const storage_key_previous_plus_daily = "previousPlusDaily";
const storage_key_user_set_language_array = "userSetLanguages";

/* CONSTANT KEY NAMES FOR OBJECTS */
// ====== DAILY STATS KEYS ======
const DATE = "date";
const TYPING_SPEED = "typing_speed";
const TYPING_ACCURACY = "typing_accuracy";
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

// ====== Export Tabel Heading constants ======
const TOTAL_COLUMN = "Total"; // Column heading for total field in export
const ALL_TIME_TOTAL_COLUMN = "All Time Total";

// ====== constant export file name ======
const exportFileName = "DailyLogs";

/* todays stats variables */
const todaysStatsForm = document.getElementById("todays-data-form");
const todaysDate = document.getElementById("todays-entry-date");
const typingSpeed = document.getElementById("typing-wpm");
const typingAccuracy = document.getElementById("typing-accuracy");
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
const editPreviousToggle = document.getElementById("edit-previous-checkbox");
/* Copy stats to clipboard or slack*/
let copyStatsDate = document.getElementById("copy-stats-date");
const copyStatsBtn = document.getElementById("copy_stats");
const showDataClipboard = document.getElementById("show-data-clipboard");
/* export secion */
const downloadCsv = document.getElementById("download-csv");
const downloadExcel = document.getElementById("download-excel");
const downloadJson = document.getElementById("download-json");
/* delete a log section */
const deleteDate = document.getElementById("delete-date");
const serialNumber = document.getElementById("serial-number");
const removeLogDateBtn = document.getElementById("remove-one-day-log");
const showDataBeforeDeleting = document.getElementById("show-data"); // to show the selected log for the date before deletion
/* output */
const outputItemsVisibility = document.querySelectorAll(
  ".output-items-visibility"
);
const outputFile = document.querySelector(".output-file");
const dailyStatsSum = document.querySelector(".daily-stats-sum");
const previousOutput = document.querySelector(".previous-output");
const previousPlusDailyStats = document.querySelector(
  ".previous-plus-dailystats"
);
const importDailyLogsBtn = document.getElementById("import-daily-logs");
// output buttons
const resetPreviousStats = document.getElementById("reset-previous-stats");

/* Popups */
// confirmation popup
const confirmationPopup = document.getElementById("ConfirmationBox");
const confirmYes = document.getElementById("confirm-yes");
const confirmNo = document.getElementById("confirm-no");
const confirmMessage = document.getElementById("confirm-message");
const confirmNote = document.getElementById("confirm-note");

/* snackbar */
const snackBar = document.getElementById("snack-bar");
const snackBarData = document.getElementById("snack-bar-data");

/* flat picker constants */
let highlightedDates = [];
let todaysDatePicker = null;

/* INITIAL loading functions  */
document.addEventListener("DOMContentLoaded", () => {
  showStats();
  updateTotalLocUI();
  //from add new langugaes
  renderLanguagesOnStartUp();
  setPreviousInputsValues();
  //to enable or disable editing in previous totals
  updateEditPreviousToggle();
  //hiding data when production
  if (debug) {
    outputItemsVisibility.forEach((outputItem) => {
      outputItem.classList.add("visible");
    });
  } else {
    outputItemsVisibility.forEach((outputItem) => {
      outputItem.classList.remove("visible");
    });
  }
  getHighlightedDates();
});

// function to refresh the dates highlighting
function refreshHighlightedDates() {
  highlightedDates = getHighlightedDates();
  if (todaysDatePicker) {
    todaysDatePicker.redraw();
  }
}
// function to get all the dates of the daily logs
function getHighlightedDates() {
  const dailyLogs = fetchDailyLogs();
  highlightedDates = dailyLogs.map((item) => item[DATE]);
  console.log("highlighted dates :", highlightedDates);

  return highlightedDates;
}
document.addEventListener("DOMContentLoaded", () => {
  refreshHighlightedDates();
  // @flat picker
  todaysDatePicker = flatpickr(todaysDate, {
    dateFormat: "Y-m-d",
    // altFormat: "d-m-Y",
    // altInput: true,
    // defaultDate: "2025.12.31",
    disableMobile: true,
    defaultDate: new Date(),
    // maxDate: new Date(),

    onChange: function (selectedDates, dateStr, fp) {
      partiallyUpdateTodaysEntry(dateStr).then(() => fp.close());
    },

    onDayCreate: function (dObj, dStr, fp, fpDayElem) {
      const date = fpDayElem.dateObj; // not dObj
      const ymd = fp.formatDate(date, "Y-m-d");

      // for highlighting submited days
      if (highlightedDates.includes(ymd)) {
        fpDayElem.classList.add("highlighted-day");
        debug && console.log("highlighting date :", ymd);
      }

      if (fpDayElem.dateObj.getDay() === 0) {
        fpDayElem.classList.add("sunday");
      }
    },
  });
});

// adding event listners to static and dynamic lines of code
programmingLanguages.forEach((section) => {
  section.addEventListener("input", updateTotalLocUI);
});

// function to add and set todays total lines of code for todays entry and previous total
//@lines of code calculation
function calculateTotalLinesOfCode() {
  let todaysTotal = 0;
  let previousTotal = 0;

  // todays fields total
  todaysTotal =
    (Number(todaysHTML.value) || 0) +
    (Number(todaysCSS.value) || 0) +
    (Number(todaysJS.value) || 0) +
    (Number(todaysReact.value) || 0);

  // previous fields total
  previousTotal =
    (Number(totalHtml.value) || 0) +
    (Number(totalCss.value) || 0) +
    (Number(totalJS.value) || 0) +
    (Number(totalReact.value) || 0);

  // now need to add user input fields total lines of code
  const userLanguages = getUserLanguages();

  userLanguages.forEach(({ key }) => {
    const userInput = document.getElementById(`${todaysPrefix}-${key}`);
    const previousInput = document.getElementById(`${previousPrefix}-${key}`);
    if (userInput) {
      todaysTotal += Number(userInput.value) || 0;
    }
    if (previousInput) {
      previousTotal += Number(previousInput.value) || 0;
    }
  });
  // todaysTotalLoc.textContent = todaysTotal;
  // totalLOCAllTime.textContent = previousTotal;

  return { todaysTotal, previousTotal };
}

//function to calculate and update the totla lines of code
function updateTotalLocUI() {
  const { todaysTotal, previousTotal } = calculateTotalLinesOfCode();
  todaysTotalLoc.textContent = todaysTotal;
  totalLOCAllTime.textContent = previousTotal;
}

// event listner for todays entry date
// todaysDate.addEventListener("change", partiallyUpdateTodaysEntry);
/* [NOTE]: using flat date picker now */

//@partialupdate function to partially update todays entries or SHOW THE VALUES OF TODATS ENTRIES IF DATA IS ALREADY SUBMITTED
async function partiallyUpdateTodaysEntry(submitDate) {
  const dailyLogs = fetchDailyLogs();
  if (!submitDate) return;
  if (dailyLogs.length == 0) {
    debug && console.log("Dialy Logs is empty");
    return;
  }
  const item = dailyLogs.find((item) => item[DATE] === submitDate);

  if (item) {
    const updateValues = await toggleConfiramtionPopup(
      `Data for ${submitDate} already exists, Do you want to update?`,
      true,
      ` This will update the input fields`
    );
    if (updateValues) {
      typingSpeed.value = item[TYPING_SPEED] || "";
      typingAccuracy.value = item[TYPING_ACCURACY] || "";
      todaysFocus.value = item[FOCUS_TIME] || "00:00:00";
      todaysCodeTime.value = item[CODE_TIME] || "00:00:00";
      todaysActiveCodeTime.value = item[ACTIVE_CODE_TIME] || "00:00:00";
      todaysHTML.value = item[HTML] || 0;
      todaysCSS.value = item[KEY_CSS] || 0;
      todaysJS.value = item[JAVASCRIPT] || 0;
      todaysReact.value = item[REACT] || 0;
      //need to add values to all user languages
      // from user languages we get the language name
      const userLanguages = getUserLanguages();
      userLanguages.forEach(({ key }) => {
        const input = document.getElementById(`${todaysPrefix}-${key}`);
        if (!input) {
          console.error("user language button not found for partial update");

          return;
        }
        input.value = item[key] || 0;
      });
      updateTotalLocUI();
    }
  }
}
// function to build daily logs object for incorporating user set languages
// @obj @dailyObj
function buildDailyLogsObject() {
  // const { todaysTotal } = calculateTotalLinesOfCode();
  // daily_logs_input_obj[DAILY_TOTAL] = todaysTotal;
  let daily_logs_input_obj = {
    [DATE]: todaysDate.value,
    [TYPING_SPEED]: typingSpeed.value,
    [TYPING_ACCURACY]: typingAccuracy.value,
    [FOCUS_TIME]: todaysFocus.value || "00:00:00",
    [CODE_TIME]: todaysCodeTime.value || "00:00:00",
    [ACTIVE_CODE_TIME]: todaysActiveCodeTime.value || "00:00:00",
    [HTML]: Number(todaysHTML.value) || 0,
    [KEY_CSS]: Number(todaysCSS.value) || 0,
    [JAVASCRIPT]: Number(todaysJS.value) || 0,
    [REACT]: Number(todaysReact.value) || 0,
    [DAILY_TOTAL]: Number(todaysTotalLoc.textContent) || 0,
  };

  // adding user set languages to the object
  const userLanguages = getUserLanguages();
  userLanguages.forEach(({ key }) => {
    const input = document.querySelector(
      `input[name="${todaysPrefix}-${key}"]`
    );
    daily_logs_input_obj[key] = input ? Number(input.value) || 0 : 0;
  });

  return daily_logs_input_obj;
}
// funtion to get the stored daily log file
function fetchDailyLogs() {
  const rawData = localStorage.getItem(storage_key_daily_log);
  return rawData ? JSON.parse(rawData) : [];
}

// sumbit event listner on todays stats - todays submit
// @todays form
todaysStatsForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  // recalculate total lines of code in case not updated from dom
  updateTotalLocUI();

  const dailyLogs = fetchDailyLogs();
  const submit_date = todaysDate.value;
  if (!submit_date) {
    showSnackBar(
      `Select a valid date before submitting, date is: ${submit_date}`,
      true
    );
    return;
  }
  if (submit_date === null || submit_date === "") {
    return;
  }
  const existingIndex = dailyLogs.findIndex(
    (item) => item.date === submit_date
  );
  debug && console.log("matched :", existingIndex);
  // showing submit confirmation if its not a existing data
  const sure2submit =
    existingIndex === -1
      ? await toggleConfiramtionPopup(
          `Submit Data for ${submit_date}?`,
          true,
          `Check all values before submitting..`
        )
      : true;
  if (!sure2submit) return;
  // building daily logs object for static and dynamic languages
  let daily_logs_input_obj = buildDailyLogsObject();

  // id date matches with output (prestored values)
  if (existingIndex !== -1) {
    const replace = await toggleConfiramtionPopup(
      `Data for ${submit_date} is already added, Do you want to replace ?`
    );
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
    refreshHighlightedDates();
  }

  // function call to calculate the dailyLogsTotal
  calculateDailyLogsTotal();
  generateTable();
  updateEditPreviousToggle();
  showDailyLogsTotal();
  showSnackBar("Data Submitted", undefined, 1000);
  copyStatsDate.value = submit_date;
  // resetting todays stats after submitting
  todaysStatsForm.reset();
  todaysTotalLoc.textContent = 0;
  setTimeout(() => {
    copyStatsBtn.dispatchEvent(new Event("input", { bubbles: true }));
    copyStatsBtn.dispatchEvent(new Event("change", { bubbles: true }));
  }, 200);
});

// function to replace todays data for a particular date
function replaceData(existingIndex, entry) {
  const dailyLogs = fetchDailyLogs();
  dailyLogs[existingIndex] = entry;
  resetIndex(dailyLogs);
  localStorage.setItem(storage_key_daily_log, JSON.stringify(dailyLogs));
  showDailyStats();
}

// function get current time
function getCurrentTime() {
  const now = new Date();

  const time = now.toLocaleString();
  debug && console.log(time);
  return time;
}

// function to add todays data
function addData(entry) {
  const dailyLogs = fetchDailyLogs();
  dailyLogs.push(entry);
  resetIndex(dailyLogs);
  localStorage.setItem(storage_key_daily_log, JSON.stringify(dailyLogs));

  showDailyStats();
}

// function to reset serial number for the objects
function resetIndex(dailyLogs) {
  dailyLogs.forEach((item, index) => {
    item.sl_no = index + 1;
  });
}
// showing todays stats in outputbox
function showDailyStats() {
  const logs = fetchDailyLogs();
  if (logs.length == 0) {
    outputFile.style.textAlign = "center";
    outputFile.textContent = "Daily Stats empty";
  } else {
    outputFile.style.textAlign = "start";
    outputFile.textContent = JSON.stringify(logs, null, 2);
  }
  debug && console.log("DailyStats:", logs);
}

/* @OUTPUT FIELD BUTTONS */
// function to display Output
function showStats() {
  showSnackBar("Updating output...", undefined, 1000);
  showDailyStats();
  showDailyLogsTotal();
  showPreviousInput();
  showPreviousPlusDaily();
}
// @reset previous stats
resetPreviousStats.addEventListener(
  "click",
  clearPreviousInputAndPreviousTotals
);

// function to @import daily logs in json
importDailyLogsBtn.addEventListener("change", function (event) {
  console.log("fle input button clicked");
  const file = event.target.files[0];
  if (!file) {
    showSnackBar("No file selected..");
    return;
  }
  if (file.type !== "application/json" && !file.name.endsWith(".json")) {
    showSnackBar("Please upload a valid json file", true);
    return;
  }
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = async function (e) {
    try {
      const jsonPlainTxt = e.target.result;
      const jsonData = JSON.parse(jsonPlainTxt);
      const { dailyLogs, previousInput, userLanguages } = jsonData;

      const userLangPresent =
        Array.isArray(userLanguages) && userLanguages.length > 0;

      const sure2delete = await toggleConfiramtionPopup(
        "Are you sure to import the data? This will DELETE all your Data",
        true,
        "Make sure to export you data for safety before import"
      );

      if (!sure2delete) return;

      // clearing the rendered languages
      clearRenderedLanguagesUI();
      // clearing the complete local storage
      await clearLocalStorage(true);

      debug && console.log("Read data :", jsonData);
      showSnackBar("Successfully read items");

      if (userLangPresent) {
        debug && console.log("Storage cleared");
        localStorage.setItem(
          storage_key_user_set_language_array,
          JSON.stringify(userLanguages)
        );
        renderLanguagesOnStartUp();
      } else {
        debug && console.log("no user languages present in json:");
      }

      if (dailyLogs) {
        localStorage.setItem(storage_key_daily_log, JSON.stringify(dailyLogs));
      }
      refreshHighlightedDates();
      if (previousInput) {
        localStorage.setItem(
          storage_key_previous_total_input,
          JSON.stringify(previousInput)
        );
      }
      console.log(
        "successfully set json values to daily logs and previous inputs"
      );
      calculateDailyLogsTotal();
      generateTable();
      showStats();
      updateEditPreviousToggle();
    } catch (error) {
      showSnackBar("Error, reading file", true);
      console.log("error reading file", error);
    } finally {
      //clearing import file so that we can import the same file again
      importDailyLogsBtn.value = "";
    }
  };
  reader.onerror = function () {
    showSnackBar("Error reading file.", true);
    console.error("FileReader error reading file:", reader.error);
  };
});

/* @Delete data buttons  _____________________________________*/
// function to delete daily stats from the local storage
async function clearDailyStats(confirmation) {
  let shouldDelete = confirmation;

  if (shouldDelete === undefined) {
    shouldDelete = await toggleConfiramtionPopup("Delete all daily stats?");
  }

  if (shouldDelete) {
    showSnackBar("Clearing Daily Stats...", undefined, 500);
    localStorage.removeItem(storage_key_daily_log);
    localStorage.removeItem(storage_key_daily_logs_sum);
    refreshHighlightedDates();
    debug && console.log("cleared dailyLogs : ", fetchDailyLogs());
    debug && console.log("cleared dailyLogs sum : ", fetchDailyLogsSum());
    showStats();
    generateTable();
    updateEditPreviousToggle();
  } else {
    return;
  }
}
// function to delete all previus stats from the local storage
async function clearPreviousInputAndPreviousTotals(confirmation) {
  let shouldDelete = confirmation;
  if (shouldDelete === undefined) {
    shouldDelete = await toggleConfiramtionPopup(
      "Do you want to delete previous totals?"
    );
  }
  if (shouldDelete) {
    showSnackBar("Clearing Previous Stats...", undefined, 1000);
    localStorage.removeItem(storage_key_previous_total_input);
    localStorage.removeItem(storage_key_previous_plus_daily);
    setPreviousInputsValues();
    refreshHighlightedDates(); //not necessary check
    debug && console.log("cleared PreviousTotalSum:", fetchPreviousPlusDaily());
    showStats();
    generateTable();
    updateEditPreviousToggle(); //not necessary check
  } else {
    return;
  }
}

/* // clear everything except previous input values from storage - used for importing json
async function clearExcept_PreviousInputs(confirmation) {
  let shouldDelete = confirmation;
  if (shouldDelete === undefined) {
    shouldDelete = await toggleConfiramtionPopup(
      "Do you want to clear everthing except previous user input values"
    );
  }
  if (shouldDelete) {
    showSnackBar("Clearing except previous input values....", undefined, 1000);
    localStorage.removeItem(storage_key_daily_log);
    localStorage.removeItem(storage_key_daily_logs_sum);
    localStorage.removeItem(storage_key_previous_plus_daily);
    debug && console.log("cleared all values except previous input");
    debug && showlocalStorageData();
  }
} */
// function to clear all values in the local storage
async function clearLocalStorage(confirmation) {
  let shouldClear = confirmation;

  if (shouldClear === undefined) {
    shouldClear = await toggleConfiramtionPopup(
      "Do you want to reset all the data stored in the browser? "
    );
  }

  if (shouldClear) {
    showSnackBar("Clearing LocalStorage...", undefined, 1000);
    // to remove addd langugaes
    clearRenderedLanguagesUI();
    localStorage.clear();
    refreshHighlightedDates();
    previousTotalsForm.reset();
    generateTable();
    showStats();
    updateEditPreviousToggle();
    return `local storage cleared successfully : ${showlocalStorageData()}`;
  }
}
/* ________________________________________________________________ */

/* function to sort daily Logs based on date */
function sortDailyLogs() {
  const dialyLogsArray = fetchDailyLogs();
  if (!dialyLogsArray || dialyLogsArray.length == 0) {
    showSnackBar("Previous Totals is empty");
    return;
  }
  const sortedDailyLogs = dialyLogsArray.sort(
    (a, b) => new Date(a[DATE]) - new Date(b[DATE])
  );
  debug && console.log("daily logs sorted for based on date", sortedDailyLogs);
  return sortedDailyLogs;
}

//@previoustilldate function to calculate totals based on the passed date
function previousTotalsTillDate(ISOdate) {
  // sorts the daily logs by date
  const sortedDailyLogs = sortDailyLogs();
  const previousTotalInput = fetchPreviousInput();
  const arrayTillDate = sortedDailyLogs.filter((log) => log[DATE] <= ISOdate);
  console.log({ sortedDailyLogs });

  const userLanguages = getUserLanguages();
  console.log(userLanguages);
  // adding thouse user languages to languages object and setting them to 0
  let userLanguagesTotals = {};
  userLanguages.forEach(({ key }) => {
    userLanguagesTotals[key] = 0;
  });

  let totalFocus = 0,
    totalCode = 0,
    totalAct = 0,
    totalHtml = 0,
    totalcss = 0,
    totaljs = 0,
    totalreact = 0,
    totallocTilldate = 0;
  // adding values till date
  arrayTillDate.forEach((log) => {
    (totalFocus += time2Seconds(log[FOCUS_TIME])),
      (totalCode += time2Seconds(log[CODE_TIME])),
      (totalAct += time2Seconds(log[ACTIVE_CODE_TIME])),
      (totalHtml += log[HTML]),
      (totalcss += log[KEY_CSS]),
      (totaljs += log[JAVASCRIPT]),
      (totalreact += log[REACT]);
    // user added languages totals
    userLanguages.forEach(
      ({ key }) => (userLanguagesTotals[key] += log[key] || 0)
    );
    totallocTilldate += log[DAILY_TOTAL];
  });
  // if previous totals were submitted by user then we need to add that to the current daily logs totals
  if (previousTotalInput) {
    (totalFocus += time2Seconds(previousTotalInput[TOTAL_FOCUS])),
      (totalCode += time2Seconds(previousTotalInput[TOTAL_CODE_TIME])),
      (totalAct += time2Seconds(previousTotalInput[TOTAL_ACTIVE_CODE_TIME])),
      (totalHtml += previousTotalInput[TOTAL_HTML]),
      (totalcss += previousTotalInput[TOTAL_CSS]),
      (totaljs += previousTotalInput[TOTAL_JS]),
      (totalreact += previousTotalInput[TOTAL_REACT]),
      (totallocTilldate += previousTotalInput[ALL_TIME_TOTAL]);
    userLanguages.forEach(({ key }) => {
      userLanguagesTotals[key] += previousTotalInput[key] || 0;
    });
  }
  return {
    [DATE]: ISOdate,
    [TOTAL_FOCUS]: secondsToHMS(totalFocus),
    [TOTAL_CODE_TIME]: secondsToHMS(totalCode),
    [TOTAL_ACTIVE_CODE_TIME]: secondsToHMS(totalAct),
    [TOTAL_HTML]: totalHtml,
    [TOTAL_CSS]: totalcss,
    [TOTAL_JS]: totaljs,
    [TOTAL_REACT]: totalreact,
    [ALL_TIME_TOTAL]: totallocTilldate,
    ...userLanguagesTotals,
  };
}

/* _________________working of previous total form_________________________________________________ */

// function to add all the values of all daily stats and then calculate the previous totals
function calculateDailyLogsTotal() {
  const dailyLogs = fetchDailyLogs();
  const userLanguages = getUserLanguages();

  const sumDailyStats = dailyLogs.reduce(
    (acc, currnt) => {
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

      // adding user set languages totals
      userLanguages.forEach(({ key }) => {
        acc.dynamicLanguages[key] =
          (acc.dynamicLanguages[key] || 0) + (currnt[key] || 0);
      });

      acc.previousTotal += currnt[DAILY_TOTAL] || 0;
      return acc;
    },

    {
      latestDate: null,
      focus: 0,
      codetime: 0,
      activeCT: 0,
      html: 0,
      css: 0,
      js: 0,
      react: 0,
      previousTotal: 0,
      dynamicLanguages: {},
    }
  );
  // @obj @dailyLogsObj
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
    ...sumDailyStats.dynamicLanguages, // adding languages fields to total object
  };

  // debug && console.log("daily logs object:", dailyLogTotalObj);
  localStorage.setItem(
    storage_key_daily_logs_sum,
    JSON.stringify(daily_logs_total_obj)
  );

  // adding dailylogs total with previous total input form values
  add_dailyStatsTotal_and_PreviousInput();
  showStats();
}

// funciton to convert time to seconds
function time2Seconds(curr) {
  if (!curr || typeof curr !== "string") {
    console.log("The value for time conversion is undefined or not a string");
    return 0;
  }
  const [h = 0, m = 0, s = 0] = curr.split(":").map(Number);
  const totalSeconds = h * 3600 + m * 60 + s;
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
  return JSON.parse(localStorage.getItem(storage_key_daily_logs_sum)) || {};
}

// function to display sum of dailyLogsSum
function showDailyLogsTotal() {
  let dailySum = fetchDailyLogsSum();
  if (Object.keys(dailySum).length === 0) {
    dailyStatsSum.style.textAlign = "center";
    dailyStatsSum.textContent = "Daily Stats Sum empty";
  } else {
    dailyStatsSum.style.textAlign = "start";
    dailyStatsSum.textContent = JSON.stringify(dailySum, null, 2);
  }
  debug && console.log("DailyStatsSum:", dailySum);
}
//update the state of toogle edit previous totals based on daily logs
function updateEditPreviousToggle() {
  if (!editPreviousToggle) return;

  const hasLogs = hasDailyLogs();

  editPreviousToggle.checked = !hasLogs;
  enableEditPreviousTotals(!hasLogs);
}

//function to check if there is data in daily logs
function hasDailyLogs() {
  const dailyLogs = fetchDailyLogs();
  return Array.isArray(dailyLogs) && dailyLogs.length > 0;
}

//@editprevious @edittoggle
editPreviousToggle.addEventListener("change", () => {
  console.log("toogle changed:", editPreviousToggle.checked);
  enableEditPreviousTotals(editPreviousToggle.checked);
});

// function to enable or disable previuos form
function enableEditPreviousTotals(enable) {
  const previousTotalsForm = document.getElementById("previous-total-form");

  if (!previousTotalsForm) return;

  const inputs = previousTotalsForm.querySelectorAll(
    "input,button, select , textarea"
  );
  previousDate.disabled = !enable;
  inputs.forEach((item) => {
    if (item.hasAttribute("data-ignore-disable")) return;
    item.disabled = !enable;
  });
}
// function to add the previous total entries into localstorage
previousTotalsForm.addEventListener("submit", async (event) => {
  debug && console.log("previous total submit button clicked");

  event.preventDefault();
  const deleteAllDailyLogs = await toggleConfiramtionPopup(
    "Setting previous total would clear all of the saved daily logs and start fresh, do you want to continue?",
    true,
    `PLEASE EXPORT ALL DAILY LOGS BEFORE SUBMITING`
  );
  if (!deleteAllDailyLogs) {
    return;
  }
  await clearDailyStats(deleteAllDailyLogs);
  // object for the previous total input fields
  //@obj @previous total obj
  let previous_total_inputs_obj = {
    [DATE]: previousDate.value,
    [TOTAL_FOCUS]: totalFocus.value || "00:00:00",
    [TOTAL_CODE_TIME]: totalCodeTime.value || "00:00:00",
    [TOTAL_ACTIVE_CODE_TIME]: totalActiveCodeTime.value || "00:00:00",
    [TOTAL_HTML]: Number(totalHtml.value) || 0,
    [TOTAL_CSS]: Number(totalCss.value) || 0,
    [TOTAL_JS]: Number(totalJS.value) || 0,
    [TOTAL_REACT]: Number(totalReact.value) || 0,
    [ALL_TIME_TOTAL]:
      (Number(totalHtml.value) || 0) +
      (Number(totalCss.value) || 0) +
      (Number(totalJS.value) || 0) +
      (Number(totalReact.value) || 0),
  };

  localStorage.setItem(
    storage_key_previous_total_input,
    JSON.stringify(previous_total_inputs_obj)
  );
  let storedPreviousTotal = localStorage.getItem(
    storage_key_previous_total_input
  );
  /*  debug &&  */ console.log(
    "PreviousTotal Input:",
    JSON.parse(storedPreviousTotal)
  );

  showSnackBar("Data Submitted", undefined, 1000);
  showStats();
  calculateDailyLogsTotal();
  add_dailyStatsTotal_and_PreviousInput();
});
// function to add previous totals input and daily logs sum
function add_dailyStatsTotal_and_PreviousInput() {
  let dailyLogsSum = fetchDailyLogsSum();
  let previousInput = fetchPreviousInput();

  // if previous input is empty set default values
  if (!previousInput || Object.keys(previousInput).length === 0) {
    previousInput = {
      [TOTAL_FOCUS]: "00:00:00",
      [TOTAL_CODE_TIME]: "00:00:00",
      [TOTAL_ACTIVE_CODE_TIME]: "00:00:00",
    };
    localStorage.setItem(
      storage_key_previous_total_input,
      JSON.stringify(previousInput)
    );
  }
  // if previous input or daily sum dosent contain the added languages add and set them to 0
  const userLanguages = getUserLanguages();
  userLanguages.forEach(({ key }) => {
    if (!(key in previousInput)) previousInput[key] = 0;
    if (!(key in dailyLogsSum)) dailyLogsSum[key] = 0;
  });

  // calculating totals perlanguage
  let languagesTotals = {};
  userLanguages.forEach(({ key }) => {
    languagesTotals[key] =
      (Number(previousInput[key]) || 0) + (Number(dailyLogsSum[key]) || 0);
  });

  // now finding the totals of all languages
  const allTimeTotal =
    // totals of static languages + user entered languages

    (previousInput[TOTAL_HTML] || 0) +
    (dailyLogsSum[HTML] || 0) +
    (previousInput[TOTAL_CSS] || 0) +
    (dailyLogsSum[KEY_CSS] || 0) +
    (previousInput[TOTAL_JS] || 0) +
    (dailyLogsSum[JAVASCRIPT] || 0) +
    (previousInput[TOTAL_REACT] || 0) +
    (dailyLogsSum[REACT] || 0) +
    //user entered languages
    Object.values(languagesTotals).reduce((a, b) => a + b, 0);

  // @obj @previousplusdaily
  let previous_plus_daily_obj = {
    [DATE]: dailyLogsSum[LATEST_DATE] || previousDate.value,
    [TOTAL_FOCUS]: secondsToHMS(
      time2Seconds(previousInput[TOTAL_FOCUS]) +
        time2Seconds(dailyLogsSum[FOCUS_TIME])
    ),
    [TOTAL_CODE_TIME]: secondsToHMS(
      time2Seconds(previousInput[TOTAL_CODE_TIME]) +
        time2Seconds(dailyLogsSum[CODE_TIME])
    ),
    [TOTAL_ACTIVE_CODE_TIME]: secondsToHMS(
      time2Seconds(previousInput[TOTAL_ACTIVE_CODE_TIME]) +
        time2Seconds(dailyLogsSum[ACTIVE_CODE_TIME])
    ),
    [TOTAL_HTML]: (previousInput[TOTAL_HTML] || 0) + (dailyLogsSum[HTML] || 0),
    [TOTAL_CSS]: (previousInput[TOTAL_CSS] || 0) + (dailyLogsSum[KEY_CSS] || 0),
    [TOTAL_JS]:
      (previousInput[TOTAL_JS] || 0) + (dailyLogsSum[JAVASCRIPT] || 0),
    [TOTAL_REACT]:
      (previousInput[TOTAL_REACT] || 0) + (dailyLogsSum[REACT] || 0),

    ...languagesTotals,
    [ALL_TIME_TOTAL]: allTimeTotal,
  };

  localStorage.setItem(
    storage_key_previous_plus_daily,
    JSON.stringify(previous_plus_daily_obj)
  );
  ALL_TIME_TOTAL;
  //show final previous total in output box
  showPreviousPlusDaily();
  // set final previous total in previous total input box
  setPreviousInputsValues();
}

// function to set the input values at previous total field
function setPreviousInputsValues() {
  let previousPlusDaily = fetchPreviousPlusDaily();
  if (!previousPlusDaily || Object.keys(previousPlusDaily).length == 0) {
    return;
  }
  previousDate.value = previousPlusDaily[DATE] || null;
  totalFocus.value = previousPlusDaily[TOTAL_FOCUS] || "00:00:00";
  totalCodeTime.value = previousPlusDaily[TOTAL_CODE_TIME] || "00:00:00";
  totalActiveCodeTime.value =
    previousPlusDaily[TOTAL_ACTIVE_CODE_TIME] || "00:00:00";
  //defaulst languages
  totalHtml.value = previousPlusDaily[TOTAL_HTML] || 0;
  totalCss.value = previousPlusDaily[TOTAL_CSS] || 0;
  totalJS.value = previousPlusDaily[TOTAL_JS] || 0;
  totalReact.value = previousPlusDaily[TOTAL_REACT] || 0;
  // for static languages total
  let allTimeTotal =
    previousPlusDaily[TOTAL_HTML] +
    previousPlusDaily[TOTAL_CSS] +
    previousPlusDaily[TOTAL_JS] +
    previousPlusDaily[TOTAL_REACT];

  //dynamically add user added languages
  const userLanguages = getUserLanguages();
  userLanguages.forEach(({ key }) => {
    const input = document.getElementById(`${previousPrefix}-${key}`);
    if (!input) {
      console.error(
        `input field dosent exists for previous total : ${previousPrefix}-${key}`
      );
    } else {
      input.value = previousPlusDaily[key] || 0;
      allTimeTotal += previousPlusDaily[key] || 0;
    }
  });
  totalLOCAllTime.textContent = allTimeTotal;
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
  // debug && console.log(`PreviousPlusDaily:${JSON.stringify(previousPlusDaily)}`);
  return previousPlusDaily;
}

// function fetch previous total
function fetchPreviousInput() {
  return (
    JSON.parse(localStorage.getItem(storage_key_previous_total_input)) || {}
  );
}

// function to display previous total
function showPreviousInput() {
  let previousTotals = fetchPreviousInput();
  let value = JSON.stringify(previousTotals, null, 2);
  if (previousTotals.length == 0 || Object.keys(previousTotals).length === 0) {
    previousOutput.style.textAlign = "center";
    previousOutput.textContent = "Previous Stats input empty";
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
    previousPlusDailyStats.textContent = "Previous Stats empty";
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
      input.style.borderColor = "";
      return;
    } else if (/[^0-9:]/.test(value)) {
      input.setCustomValidity(
        "only nymbers and ':' are allowed (eg 36:12:14 )"
      );
      input.reportValidity();
    } else if (validateTime(value)) {
      debug && console.log("input ok");
      input.style.borderColor = "green";
      input.setCustomValidity("");
    } else if (!value.includes(":") && value !== "") {
      input.setCustomValidity("Time must include ':' (use HH:MM or HH:MM:SS)");
      input.reportValidity();
      input.style.borderColor = "red";
    } else if (value.includes(":")) {
      input.setCustomValidity("Use this format HH:MM:SS or HH:MM");
      input.reportValidity();
      input.style.borderColor = "red";
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
  const paste = (event.clipboardData || window.clipboardData).getData("text");
  let pastedWithoutSpaces = paste.replace(/\s/g, "");
  // still not able to paste text from input field have to check why :10:10:10
  pastedWithoutSpaces = pastedWithoutSpaces
    .replace(/\uFF1A/g, ":") // replace fullwidth colon with normal colon
    .replace(/\u200B|\u200F/g, ""); // remove invisible unicode chars

  debug && console.log("clipboard data :", pastedWithoutSpaces);
  debug && console.log(`clipboard data : '${pastedWithoutSpaces}'`);

  const match = pastedWithoutSpaces.match(
    /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/
  );
  if (match) {
    event.target.setCustomValidity("");
    let partsOfInput = pastedWithoutSpaces.split(":");

    if (partsOfInput[0].length === 1) {
      //if hour is single digit then adding 0 before
      partsOfInput[0] = "0" + partsOfInput[0];
    }
    if (partsOfInput.length === 2) {
      // if time is hh:mm then adding 00 as seconds
      partsOfInput.push("00");
    }
    event.target.value = partsOfInput.join(":");
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

document
  .querySelectorAll('#todays-data-form input[type="time"]')
  .forEach((input) => {
    input.addEventListener("copy", allowCopying);
  });

/* popups */
// function to handle confirmation messages
// note this is an asysc function so while calling it its an await call else you will always get true
async function toggleConfiramtionPopup(
  message,
  shouldDisplyNote = true,
  importantNote = "",
  anchorElement
) {
  return new Promise((resolve) => {
    confirmMessage.textContent = message;
    if (shouldDisplyNote == false) {
      confirmNote.style.display = "none";
    } else {
      confirmNote.style.display = "block";
      confirmNote.textContent = `Note: This action cannot be undone!`;
      if (importantNote != "") {
        confirmNote.textContent = importantNote;
      }
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
/* Manage Data Section */

/* copy date even listner */
copyStatsDate.addEventListener("input", () => {
  const dailyLogs = fetchDailyLogs();
  const date = copyStatsDate.value;
  const data = dailyLogs.filter((logs) => logs[DATE] == date);

  showDataClipboard.textContent = JSON.stringify(data, null, 2);
});
/*@copy Copying the data in the format of the slack */
copyStatsBtn.addEventListener("click", () => {
  {
    // we need to add previous total input values and daily logs till date as the total value
    const dailyLogs = fetchDailyLogs();

    const logForTheDate = dailyLogs.find(
      (stats) => stats[DATE] === copyStatsDate.value
    );
    if (!dailyLogs || Object.keys(dailyLogs).length === 0) {
      debug && console.log("Daily Logs has not been added");
      showSnackBar("Daily Logs not found", true);
      return;
    } else if (!copyStatsDate.value) {
      showSnackBar("Select a date", true);
    } else if (!logForTheDate) {
      debug && console.log("Logs for the selected date is missing");
      showSnackBar("logs for selected date is missing", true);
      return;
    } else {
      let totalTillDate = previousTotalsTillDate(copyStatsDate.value);
      let logsTillDate = totalTillDate;
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

      let hasEnterdTypingStats =
        logForTheDate[TYPING_SPEED] && logForTheDate[TYPING_ACCURACY]
          ? true
          : false;
      const StatsForTheDay = `
        Date     : [${logForTheDate[DATE]}]
        ${
          hasEnterdTypingStats
            ? `Typing   : [${logForTheDate[TYPING_SPEED]} wpm] [${logForTheDate[TYPING_ACCURACY]}%]`
            : ""
        } 
        Focus    : [${formatOutputTime(
          logForTheDate[FOCUS_TIME]
        )}] [${formatOutputTime(logsTillDate[TOTAL_FOCUS])}]
        CT       : [${formatOutputTime(
          logForTheDate[CODE_TIME]
        )}] [${formatOutputTime(logsTillDate[TOTAL_CODE_TIME])}]
        ACT      : [${formatOutputTime(
          logForTheDate[ACTIVE_CODE_TIME]
        )}] [${formatOutputTime(logsTillDate[TOTAL_ACTIVE_CODE_TIME])}]
        HTML     : [${logForTheDate[HTML] || 0}] [${
        logsTillDate[TOTAL_HTML] || 0
      }]
        CSS      : [${logForTheDate[KEY_CSS] || 0}] [${
        logsTillDate[TOTAL_CSS] || 0
      }]
        JS       : [${logForTheDate[JAVASCRIPT] || 0}] [${
        logsTillDate[TOTAL_JS] || 0
      }]
        React    : [${logForTheDate[REACT] || 0}] [${
        logsTillDate[TOTAL_REACT] || 0
      }]
        Total    : [${logForTheDate[DAILY_TOTAL]}] [${
        logsTillDate[ALL_TIME_TOTAL]
      }]
        `;
      // formating the stats to remove the spaces in the starting and ending of the line
      const statsForTheDayFormated = StatsForTheDay.split("\n")
        .map((eachLine) => eachLine.trim())
        .filter((eachLine) => eachLine)
        .join("\n");
      console.log("Clipboard Data : ", StatsForTheDay);
      console.log("Clipboard Data : ", statsForTheDayFormated);
      navigator.clipboard
        .writeText(statsForTheDayFormated)
        .then(() => console.log(`stats for ${copyStatsDate.value} copied`))
        .catch((err) => console.log(`error copying data ${err}`));

      showSnackBar(`Stats for ${copyStatsDate.value} copied`);
    }
  }
});

/* delete buton  */
deleteDate.addEventListener("input", () => showDataDate());
//for every input of the serial number show logs from daily logs
serialNumber.addEventListener("input", () => showDataSerial());

/* show data for the required date */
function showDataDate() {
  serialNumber.value = "";
  const dailyLogs = fetchDailyLogs();
  const selectedDate = deleteDate.value;
  const targetObject = dailyLogs.filter((logs) => logs[DATE] == selectedDate);
  showDataBeforeDeleting.textContent =
    targetObject.length === 0 ? "" : JSON.stringify(targetObject, null, 2);
}
/* Show data for the requied serial number */
function showDataSerial() {
  deleteDate.value = "";
  const dailyLogs = fetchDailyLogs();
  const slNoselected = serialNumber.value;
  const targetObject = dailyLogs.filter(
    (logs) => Number(logs[SL_NO]) == Number(slNoselected)
  );
  // console.log("Target object is", JSON.stringify(targetObject));
  showDataBeforeDeleting.textContent =
    targetObject.length === 0 ? "" : JSON.stringify(targetObject, null, 2);
}
/* remove an item based on slno or date */
//@delete log
removeLogDateBtn.addEventListener("click", async () => {
  const dailyLogs = fetchDailyLogs();

  const slno = serialNumber.value;
  const selectedDate = deleteDate.value;
  if (!slno && !selectedDate) {
    showSnackBar("Select date or sl no. to continue", true, 2000);
    return;
  }
  if (slno && selectedDate) {
    showSnackBar("Select either date or serial number not both", true, 2000);
    return;
  }
  const idtoShow = slno || selectedDate;
  const sure2delete = await toggleConfiramtionPopup(
    `Are You sure to delete the data for ${idtoShow}`,
    removeLogDateBtn
  );
  if (sure2delete === false) {
    return;
  } else {
    let index = -1;
    if (slno) {
      index = dailyLogs.findIndex(
        (logs) => Number(logs[SL_NO]) == Number(slno)
      );
    } else if (selectedDate) {
      index = dailyLogs.findIndex((logs) => logs[DATE] == selectedDate);
    }

    if (index !== -1) {
      const removedTarget = dailyLogs.splice(index, 1);
      resetIndex(dailyLogs);
      console.log("Removed data from dailyLog: ", removedTarget);
      console.log("Updated daily slno: ", dailyLogs);
      localStorage.setItem(storage_key_daily_log, JSON.stringify(dailyLogs));
      updateEditPreviousToggle();
      refreshHighlightedDates();
      showSnackBar("Deleted data.");
      calculateDailyLogsTotal();
      generateTable();
      serialNumber.value = "";
      deleteDate.value = "";
      showDataBeforeDeleting.textContent = "";
      // if (slno) {
      //   showDataSerial();
      //   serialNumber.value = "";
      // } else {
      //   showDataDate();
      //   deleteDate.value = "";
      // }
    } else {
      showSnackBar("No matching entry found", true);
    }
  }
});

/* DOWNLOAD SECTION or export section */
// event listeners to download csv file
//@export csv @download
downloadCsv.addEventListener("click", () => {
  const currentDateTime = getCurrentTime();
  const dailyLogs = fetchDailyLogs();
  const userLanguages = getUserLanguages();
  const dailyLogsSum = fetchDailyLogsSum();
  // if we have not stored any daily logs yet
  if (!dailyLogs.length) {
    showSnackBar("No daily Logs found to download", true);
    return;
  }
  showSnackBar("file downloading...", undefined, 1200);

  const logsForCsv = [...dailyLogs];

  // fetchig daily logs sum and pushing it into the end row.
  if (dailyLogsSum && Object.keys(dailyLogsSum).length > 0) {
    // making key,value array of language and values and then converting it to an object of key: value
    const languageValues = Object.fromEntries(
      userLanguages.map(({ key }) => [key, dailyLogsSum[key] ?? ""])
    );

    logsForCsv.push({
      [TOTAL_COLUMN]: TOTAL_COLUMN,
      [DATE]: dailyLogsSum[LATEST_DATE],
      [FOCUS_TIME]: dailyLogsSum[FOCUS_TIME],
      [CODE_TIME]: dailyLogsSum[CODE_TIME],
      [ACTIVE_CODE_TIME]: dailyLogsSum[ACTIVE_CODE_TIME],
      [HTML]: dailyLogsSum[HTML],
      [KEY_CSS]: dailyLogsSum[KEY_CSS],
      [JAVASCRIPT]: dailyLogsSum[JAVASCRIPT],
      [REACT]: dailyLogsSum[REACT],
      ...languageValues,
      [DAILY_TOTAL]: dailyLogsSum[DAILY_TOTAL],
    });
  }
  const previousTotals = fetchPreviousPlusDaily();
  if (previousTotals && Object.keys(previousTotals).length > 0) {
    const languageValues = Object.fromEntries(
      userLanguages.map(({ key }) => [key, previousTotals[key] ?? ""])
    );

    logsForCsv.push({
      [TOTAL_COLUMN]: ALL_TIME_TOTAL_COLUMN,
      [DATE]: previousTotals[DATE],
      [FOCUS_TIME]: previousTotals[TOTAL_FOCUS],
      [CODE_TIME]: previousTotals[TOTAL_CODE_TIME],
      [ACTIVE_CODE_TIME]: previousTotals[TOTAL_ACTIVE_CODE_TIME],
      [HTML]: previousTotals[TOTAL_HTML],
      [KEY_CSS]: previousTotals[TOTAL_CSS],
      [JAVASCRIPT]: previousTotals[TOTAL_JS],
      [REACT]: previousTotals[TOTAL_REACT],
      ...languageValues,
      [DAILY_TOTAL]: previousTotals[ALL_TIME_TOTAL],
    });
  }
  // Create CSV
  const headers = [
    TOTAL_COLUMN,
    "Date",
    "Focus Time",
    "Code Time",
    "Active Code Time",
    "HTML",
    "CSS",
    "JS",
    "React",
    ...userLanguages.map(({ key }) => String(key)),
    "DailyTotal",
    "Typing Speed",
    "Typing Accuracy",
  ];
  const rows = logsForCsv.map((obj) => {
    let serialOrLabel = "";
    if (obj[TOTAL_COLUMN] === TOTAL_COLUMN) {
      serialOrLabel = TOTAL_COLUMN;
    } else if (obj[TOTAL_COLUMN] === ALL_TIME_TOTAL_COLUMN) {
      serialOrLabel = ALL_TIME_TOTAL_COLUMN;
    } else {
      serialOrLabel = obj[SL_NO];
    }

    // receiving the values for each user langugaes
    const languageValues = userLanguages.map(({ key }) => obj[key] ?? "");
    //[NOTE] make sure the header order and the language values are in order
    return [
      serialOrLabel,
      obj[DATE],
      obj[FOCUS_TIME],
      obj[CODE_TIME],
      obj[ACTIVE_CODE_TIME],
      obj[HTML],
      obj[KEY_CSS],
      obj[JAVASCRIPT],
      obj[REACT],
      ...languageValues,
      obj[DAILY_TOTAL],
      obj[TYPING_SPEED] ? obj[TYPING_SPEED] + " wpm" : "",
      obj[TYPING_ACCURACY] ? obj[TYPING_ACCURACY] + "%" : "",
    ].join(",");
  });

  const csvData = headers.join(",") + "\n" + rows.join("\n");
  debug && console.log("csv file :", csvData);

  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${
    debug
      ? "debug " + currentDateTime
      : "" + exportFileName + " " + currentDateTime
  }.csv`;
  link.click();
});

// @export excel
// download excel file
downloadExcel.addEventListener("click", () => {
  const currentDateTime = getCurrentTime();
  const dailyLogs = fetchDailyLogs();
  const dailyLogsSum = fetchDailyLogsSum();
  const userLanguages = getUserLanguages();

  if (!dailyLogs.length) {
    showSnackBar("No daily Logs found to download", true);
    return;
  }
  showSnackBar("file downloading...", undefined, 1200);

  const logsForExcel = [...dailyLogs];

  // Add total row at the end
  if (dailyLogsSum && Object.keys(dailyLogsSum).length > 0) {
    const languageTotals = Object.fromEntries(
      userLanguages.map(({ key }) => [key, dailyLogsSum[key] ?? ""])
    );
    logsForExcel.push({
      [TOTAL_COLUMN]: TOTAL_COLUMN, // first column
      [DATE]: dailyLogsSum[LATEST_DATE],
      [FOCUS_TIME]: dailyLogsSum[FOCUS_TIME],
      [CODE_TIME]: dailyLogsSum[CODE_TIME],
      [ACTIVE_CODE_TIME]: dailyLogsSum[ACTIVE_CODE_TIME],
      [HTML]: dailyLogsSum[HTML],
      [KEY_CSS]: dailyLogsSum[KEY_CSS],
      [JAVASCRIPT]: dailyLogsSum[JAVASCRIPT],
      [REACT]: dailyLogsSum[REACT],
      ...languageTotals,
      [DAILY_TOTAL]: dailyLogsSum[DAILY_TOTAL],
    });
  }
  const previousTotals = fetchPreviousPlusDaily();
  if (previousTotals || previousTotals.length != 0) {
    const languageTotals = Object.fromEntries(
      userLanguages.map(({ key }) => [key, previousTotals[key] ?? ""])
    );
    logsForExcel.push({
      [TOTAL_COLUMN]: ALL_TIME_TOTAL_COLUMN,
      [DATE]: previousTotals[DATE],
      [FOCUS_TIME]: previousTotals[TOTAL_FOCUS],
      [CODE_TIME]: previousTotals[TOTAL_CODE_TIME],
      [ACTIVE_CODE_TIME]: previousTotals[TOTAL_ACTIVE_CODE_TIME],
      [HTML]: previousTotals[TOTAL_HTML],
      [KEY_CSS]: previousTotals[TOTAL_CSS],
      [JAVASCRIPT]: previousTotals[TOTAL_JS],
      [REACT]: previousTotals[TOTAL_REACT],
      ...languageTotals,
      [DAILY_TOTAL]: previousTotals[ALL_TIME_TOTAL],
    });
  }
  // Adding headers so that i can add total column at the beginning
  // const headers = [String([TOTAL_COLUMN]), String([[DATE]]), String([FOCUS_TIME]), String([CODE_TIME]), String([ACTIVE_CODE_TIME]), String([HTML]), String([KEY_CSS]), String([JAVASCRIPT]), String([REACT]), String([DAILY_TOTAL])];
  // const headers = [TOTAL_COLUMN];
  const headers = [
    TOTAL_COLUMN,
    DATE,
    FOCUS_TIME,
    CODE_TIME,
    ACTIVE_CODE_TIME,
    HTML,
    KEY_CSS,
    JAVASCRIPT,
    REACT,
    ...userLanguages.map(({ key }) => key),
    DAILY_TOTAL,
    TYPING_SPEED,
    TYPING_ACCURACY,
  ];

  const worksheet = XLSX.utils.json_to_sheet(logsForExcel, { header: headers });
  // console.log(worksheet);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "All daily logs");
  XLSX.writeFile(
    workbook,
    `${
      debug
        ? "debug " + currentDateTime
        : "" + exportFileName + " " + currentDateTime
    }.xlsx`
  );
});

// @export json
// donwload daily Logs in json format
downloadJson.addEventListener("click", () => {
  const currentDateTime = getCurrentTime();
  const dailyLogs = fetchDailyLogs();
  const previousInput = fetchPreviousInput();
  const previousTotal = fetchPreviousPlusDaily();
  //for user languages
  const userLanguages = getUserLanguages();
  if (!dailyLogs.length) {
    showSnackBar("No daily logs found to export", true, 2000);
    return;
  }

  const exportData = {
    previousTotal: previousTotal,
    previousInput: previousInput,
    dailyLogs: dailyLogs,
    userLanguages: userLanguages,
    exportTime: currentDateTime,
  };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${
    debug ? "debug " + currentDateTime : exportFileName + " " + currentDateTime
  }.json`;
  link.click();
});

/* admin items */
// function to print all the values in the localStorage
function showlocalStorageData() {
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
}

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
