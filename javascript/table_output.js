const table = document.querySelector("#output-table");
const tableHead = table.querySelector("thead");
const tableBody = table.querySelector("tbody");
const tableFooter = table.querySelector("tfoot");
const checkTable = function () {
  console.log("checktable:", tableHead);
};

function generateTable() {
  tableBody.innerHTML = "";
  tableFooter.innerHTML = "";
  const dailyLogs = fetchDailyLogs();
  const previousInput = fetchPreviousInput();

  const previousTotals = fetchPreviousPlusDaily();
  const userLanguages = getUserLanguages();

  const headers = [
    "Sl no.",
    "Date",
    "Focus Time",
    "Code Time",
    "Active Code Time",
    "HTML",
    "CSS",
    "JS",
    "React",
    ...userLanguages.map(({ label }) => String(label)),
    "DailyTotal",
    "Typing Speed",
    "Typing Accuracy",
  ];
  tableHead.innerHTML = "";
  const tr = document.createElement("tr");
  //create tr element and set text content to headers
  headers.forEach((head) => {
    const th = document.createElement("th");
    th.classList.add("headers");
    th.textContent = head;
    tr.appendChild(th);
  });
  tableHead.appendChild(tr);
  if (!Array.isArray(dailyLogs) || dailyLogs.length === 0) {
    tableBody.innerHTML = `
    <tr>
        <td colspan = "${headers.length}">
            No data
        </td>
    </tr>`;
  }
  //when daily logs exists
  [...dailyLogs].reverse().forEach((obj) => {
    const tr = document.createElement("tr");

    //since objects the keys are not in order so
    const rowData = [
      obj[SL_NO],
      obj[DATE],
      obj[FOCUS_TIME],
      obj[CODE_TIME],
      obj[ACTIVE_CODE_TIME],
      obj[HTML],
      obj[KEY_CSS],
      obj[JAVASCRIPT],
      obj[REACT],
      ...userLanguages.map(({ key }) => obj[key] ?? 0),
      obj[DAILY_TOTAL],
      obj[TYPING_SPEED] ? obj[TYPING_SPEED] + " wpm" : "",
      obj[TYPING_ACCURACY] ? obj[TYPING_ACCURACY] + "%" : "",
    ];
    rowData.forEach((row) => {
      const td = document.createElement("td");
      (td.textContent = row), tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });

  const trPrevious = document.createElement("tr");
  trPrevious.classList.add("table-previousInput");
  const trGrandTotal = document.createElement("tr");
  trGrandTotal.classList.add("table-grandTotal");

  const hasPreviousInput =
    previousInput && Object.keys(previousInput).length > 0;
  const hasPreviousTotal =
    previousTotals && Object.keys(previousTotals).length > 0;

  //appending prevoius input
  if (hasPreviousInput) {
    const previousInputRow = [
      "Previous",
      previousInput[DATE],
      previousInput[TOTAL_FOCUS] ?? "",
      previousInput[TOTAL_CODE_TIME] ?? "",
      previousInput[TOTAL_ACTIVE_CODE_TIME] ?? "",
      previousInput[TOTAL_HTML] ?? 0,
      previousInput[TOTAL_CSS] ?? 0,
      previousInput[TOTAL_JS] ?? 0,
      previousInput[TOTAL_REACT] ?? 0,
      ...userLanguages.map(({ key }) => previousInput[key] ?? 0),
      previousInput[ALL_TIME_TOTAL] ?? 0,
      "", //typing speed average
      "",
    ];

    previousInputRow.forEach((val) => {
      const td = document.createElement("td");
      td.textContent = val;
      trPrevious.appendChild(td);
    });
    tableFooter.appendChild(trPrevious);
  }
  if (hasPreviousTotal) {
    const grandTotalRow = [
      "Grand Total",
      previousTotals[DATE],
      previousTotals[TOTAL_FOCUS] ?? "",
      previousTotals[TOTAL_CODE_TIME] ?? "",
      previousTotals[TOTAL_ACTIVE_CODE_TIME] ?? "",
      previousTotals[TOTAL_HTML] ?? 0,
      previousTotals[TOTAL_CSS] ?? 0,
      previousTotals[TOTAL_JS] ?? 0,
      previousTotals[TOTAL_REACT] ?? 0,
      ...userLanguages.map(({ key }) => previousTotals[key] ?? 0),
      previousTotals[ALL_TIME_TOTAL] ?? 0,
      "", //typing speed average
      "",
    ];
    grandTotalRow.forEach((totals) => {
      const td = document.createElement("td");
      (td.textContent = totals), trGrandTotal.appendChild(td);
    });

    tableFooter.appendChild(trGrandTotal);
    table.appendChild(tableFooter);
  }
}

generateTable();
