
let dateField = null;

function setCurrentDate() {
    // YYYY-MM-DD format
    dateField.value = new Date().toISOString().split('T')[0];
}

window.addEventListener('DOMContentLoaded', () => {
    const buttonName = "createBookingBtn";
    const button = document.getElementById(buttonName);

    if (button) {
        setElement('fixedDate')
        setCurrentDate();
    } else {
        console.error('Element with id "'+buttonName+'" not found');
    }
});


// ---- helper ----

function setElement(idName) {
    dateField = document.getElementById(idName);

    if (!dateField) {
        console.error('Element with id "' + idName + '" not found');
    }
}