/* constants */
// add language popup
const addLanButton = document.getElementById("add-lan-btn");
const addLanPopup = document.getElementById("add-lan-popup");
const confirmAddLan = document.getElementById("confirm-lan-add");
const cancelAddLan = document.getElementById("cancel-lan-add");
const languageNameInput = document.getElementById("language-name");
const backdropAddLan = document.getElementById("backdrop-add-lan");
const addLanForm = document.getElementById("add-language-form");
const todaysPrefix = "todays"; //for user language input fields
const previousPrefix = "previous";
const existingLanguages = ["html", "css", "js", "javascript", "react"];

/* form constants */
const programmingLanguages = document.querySelectorAll(".programing-languages");
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
  languageNameInput.setCustomValidity("");
  let rawName = languageNameInput.value.trim();
  // languageName = languageNameInput.value.trim().toLowerCase();

  if (!rawName) {
    languageNameInput.setCustomValidity("Language name cannot be empty.");
    languageNameInput.reportValidity();
    return;
  }
  const lettesrOnly = /^[A-Za-z+# ]+$/;
  if (!lettesrOnly.test(rawName)) {
    languageNameInput.setCustomValidity(
      "Language name can contain only letters, +, # and spaces."
    );
    languageNameInput.reportValidity();
    return;
  }

  const langKey = createLangKey(rawName);
  if (existingLanguages.includes(langKey)) {
    showSnackBar(`${rawName} is already a build-in language.`, true);
    return;
  }

  let savedLanguages =
    JSON.parse(localStorage.getItem(storage_key_user_set_language_array)) || [];

  //checking for duplicate values
  const alreadyExists = savedLanguages.some((lang) => lang.key === langKey);
  // if already exists then return
  if (alreadyExists) {
    showSnackBar(`${rawName} already added!`, true);
    return;
  }
  // adding to languages array
  savedLanguages.push({
    key: langKey,
    label: rawName,
  });
  // setting to local storage
  localStorage.setItem(
    storage_key_user_set_language_array,
    JSON.stringify(savedLanguages)
  );
  // rendering language
  renderLanguages(rawName, langKey);

  backdropAddLan.classList.remove("visible");
  addLanForm.reset();
}
// removing previous validation errors while typing
languageNameInput.addEventListener("input", () => {
  languageNameInput.setCustomValidity("");
});

//replace spaces with underscores , make lowercase - for language ids
const createLangKey = (lang) =>
  lang
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "") // for removing white spaces
    .replace(/[^a-z0-9+#]/g, ""); // for removing any other characters other this set

/* function to add the languages to the todays stats */
function renderLanguages(langName, langKey) {
  programmingLanguages.forEach((section) => {
    const formItem = document.createElement("div");
    formItem.classList.add("form-item");

    //need to check if the element if for previous or todays stats
    const isPreviousSection =
      section.closest("form").id === "previous-total-form";
    const prefix = isPreviousSection ? previousPrefix : todaysPrefix;
    const inputId = `${prefix}-${langKey}`;
    formItem.innerHTML = `
        <label for="${inputId}">${langName}</label>
        <input type="number" id="${inputId}" name="${inputId}" data-lang="${langKey}" placeholder="10" min="0"
        title="Total lines of ${langName} code written">
        `;
    //  <button type="button" class="delete-lang" data-lang="${languageName}">x</button>
    section.appendChild(formItem);
  });

  // attachDeleteHandlers();
}

// for everly languages added by the user rendering it while page load
window.addEventListener("DOMContentLoaded", () => {
  renderLanguagesOnStartUp();

  setPreviousInputsValues();
});

// create elements on refresh / page load
function renderLanguagesOnStartUp() {
  const userLanguages = getUserLanguages();
  userLanguages.forEach(({ key, label }) => {
    renderLanguages(label, key);
  });
}

// function to get user languages
function getUserLanguages() {
  return (
    JSON.parse(localStorage.getItem(storage_key_user_set_language_array)) || []
  );
}

/* 
DELETING A LANGUAGE WOULD MAKE TOTAL MISMATCH IN DAILY LOGS SUM VS PREVIOUS TOTALS.
SO DELETING A LANGUAGE MUST ALSO DELETE THE VALUES IN DAILY STATS , WILL IMPLEMENT IT LATER
note : add the delete button while rendering the languages , also add delete handlers function call when rendering

// function to delete language
function deleteALanguage(languageName) {
  let savedLanguages =
    JSON.parse(localStorage.getItem(storage_key_user_set_language_array)) || [];

  if (savedLanguages.length === 0) {
    return;
  }
  //removing the seletect language form the saved languages array
  savedLanguages = savedLanguages.filter((lang) => lang.key !== languageName);
  localStorage.setItem(
    storage_key_user_set_language_array,
    JSON.stringify(savedLanguages)
  );
  // deleting the lan from ui
  document
    .querySelectorAll(`[data-lang="${languageName}"]`)
    .forEach((languages) => {
      languages.closest(".form-item").remove();
    });
}

// adding event listners for every new x / delete button
function attachDeleteHandlers() {
  const deleteLanguages = document.querySelectorAll(".delete-lang"); // need to access it when new delete button added

  deleteLanguages.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", function () {
      const languageName = this.dataset.lang;
      console.log("Deleting language...", languageName);
      deleteALanguage(languageName);
    });
  });
}
 */
