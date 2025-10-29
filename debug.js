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