/* constants */
// add language popup
const addLanButton = document.getElementById("add-lan-btn");
const addLanPopup = document.getElementById("add-lan-popup");
const confirmAddLan = document.getElementById("confirm-lan-add");
const cancelAddLan = document.getElementById("cancel-lan-add");
const inputName = document.getElementById("language-name");
const backdropAddLan = document.getElementById("backdrop-add-lan");
const addLanForm = document.getElementById("add-language-form");
/* form constants */
const programingLanguages = document.querySelectorAll(".programing-languages");
let languageName = "";

/* show popup */
addLanButton.addEventListener("click", () => {
    backdropAddLan.classList.add("visible");

});

/* close popup */
backdropAddLan.addEventListener("click", () => {
    backdropAddLan.classList.remove("visible");
});

/* dont remove backdrop  on clicking inide the popup */
addLanPopup.addEventListener("click", (e) => {
    e.stopPropagation();
});

cancelAddLan.addEventListener("click", () => {
    backdropAddLan.classList.remove("visible");
    addLanForm.reset();
});
addLanForm.addEventListener("submit", submitLanguage);

/* FUNCTION TO SUBMIT LANGUAGE NAME . */
function submitLanguage(e) {
    e.preventDefault();
    inputName.setCustomValidity("");
    languageName = inputName.value.trim();
    if (!languageName) {
        inputName.setCustomValidity("Language name cannot be empty.");
        inputName.reportValidity();
        return;
    }
    const lettesrOnly = /^[A-Za-z]+$/;
    if (!lettesrOnly.test(languageName)) {
        inputName.setCustomValidity("Language name contain numbers.");
        inputName.reportValidity();
    }
    languageName = languageName.charAt(0).toUpperCase() + languageName.slice(1).toLowerCase();
    console.log("Added language:", languageName);
    backdropAddLan.classList.remove("visible");
    renderLanguages(languageName);
    addLanForm.reset();
};

/* function to add the languages to the todays stats */
function renderLanguages(languageName) {
    console.log(programingLanguages);
    programingLanguages.forEach((section) => {
        const div = document.createElement("div");
        div.innerHTML =
            `<div class="form-item">
        <label for="${languageName}">${languageName}</label>
        <input type="number" id="${languageName}" name="${languageName}" placeholder="121" min="0"
        title="Total lines of ${languageName} code written">
        </div>`;
        section.appendChild(div);

    });




}