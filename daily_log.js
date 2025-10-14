

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
