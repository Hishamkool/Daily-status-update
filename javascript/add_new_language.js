// add language popup
const addLanButton = document.getElementById("add-lan-btn");
const addLanPopup = document.getElementById("add-lan-popup");
const confirmAddLan = document.getElementById("confirm-lan-add");
const cancelAddLan = document.getElementById("cancel-lan-add");
const languageNameInput = document.getElementById("language-name");
const backdropAddLan = document.getElementById("backdrop-add-lan");
const addLanForm = document.getElementById("add-language-form");
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
    languageNameInput.setCustomValidity("");
    let name = languageNameInput.value.trim(); 
    if (!name) {
        languageNameInput.setCustomValidity("Language name cannot be empty.");
        languageNameInput.reportValidity();
        return;
    }  
    const lettesrOnly = /^[A-Za-z]+$/;
    if (!lettesrOnly.test(name)) {
        languageNameInput.setCustomValidity("Language name contain numbers.");
        languageNameInput.reportValidity();
    } 
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    console.log("Added language:", name);
    backdropAddLan.classList.remove("visible");
    addLanForm.reset(); 
};