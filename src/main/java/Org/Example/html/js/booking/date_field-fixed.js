
let dateField = "";


function setCurrentDate() {
    // Get the current date in YYYY-MM-DD format
    dateField.value = new Date().toISOString().split('T')[0];

}

window.addEventListener('DOMContentLoaded', () => {

    const buttonName = "createBookingBtn";
    const button = document.getElementById(buttonName);


    if (button) {
        setConstants('fixedDate')
        setCurrentDate();

    } else {
        console.error('Element with id "'+buttonName+'" not found');
    }
});


// ---- helper ----

function setConstants(elementByIdName) {

    try {
        dateField = document.getElementById(elementByIdName);
    } catch (e) {
        console.error('Element with id "' +elementByIdName +'" not found');
    }

}