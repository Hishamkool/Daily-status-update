/* [debug] remove this function ------------------------ */
function setRandomValuesToLinesOfCode() {
    showSnackBar("Random values set to todays stats, total changed", true, 3000);
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

/* // if all time total is not already set
    function setAllTimeTotalForPreviousInput() {
        const prevInput =
        {
            "date": "2025-10-03",
            "total_focus": "353:43:13",
            "total_code_time": "218:10:47",
            "total_active_code_time": "167:08:45",
            "total_html": 1485,
            "total_css": 6099,
            "total_js": 1061,
            "total_react": 0
        };
        console.log("previous total input now:", prevInput);

        if (
            prevInput &&
            (prevInput[ALL_TIME_TOTAL] == null || prevInput[ALL_TIME_TOTAL] === "")
        ) {
            const totalValue =
                Number(prevInput[TOTAL_HTML] || 0) +
                Number(prevInput[TOTAL_CSS] || 0) +
                Number(prevInput[TOTAL_JS] || 0) +
                Number(prevInput[TOTAL_REACT] || 0);

            console.log("all time total is:", totalValue);

            prevInput[ALL_TIME_TOTAL] = totalValue;
            localStorage.setItem(
                storage_key_previous_total_input,
                JSON.stringify(prevInput)
            );

            console.log("value added:", prevInput);
        }
    } */

