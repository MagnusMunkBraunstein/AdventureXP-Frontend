const urlGetTimeslots = "localhost:8080/booking/available-timeslots";

let timeslots = [];


// ------------------------ init ------------------------
window.addEventListener('DOMContentLoaded', () => {
    // event:
    const activityChosen = "selActivity";
    const element = document.getElementById(activityChosen);

    // if event exists
    if (element) {
        initElement('timeslots')

        fetchTimeslotsAndFillDropdown(element);
    } else {
        console.error('Element with id "'+buttonName+'" not found');
    }
});





// ------------------------ functions ------------------------

// fetch
async function fetchTimeslotsAndFillDropdown(activity) {
    const activityId = activity.id;
    const date = document.getElementById('fixedDate').value;
    const personsAmount = document.getElementById('personsAmount').value;

    let timeslots = await fetch(urlGetTimeslots + "?activityId=" + activityId + "&date=" + date + "&personsAmount=" + personsAmount)
        .then(response => response.json())
        .then(data => {
            return data;
        });

    var selTimeslot = document.getElementById("selTimeslot");

    timeslots.forEach(function(timeslot){
        var option = document.createElement('option')
        option.value = timeslot.id;
        option.text = timeslot.time;
        selTimeslot.add(option);
    });
}

// ------------------------ helper ------------------------

function initElement(idName) {
    dateField = document.getElementById(idName);

    if (!dateField) {
        console.error('Element with id "' + idName + '" not found');
    }
}