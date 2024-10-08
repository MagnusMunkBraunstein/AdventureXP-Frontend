
console.log("Vi er i fetchURL.js");

const API_URL = 'http://localhost:8080/Activity';


document.addEventListener('DOMContentLoaded', () => {
    fetchActivities();
    document.getElementById('add-activity-button').addEventListener('click', showAddActivityModal);
    document.getElementById('delete-activity-button').addEventListener('click', deleteActivity);
    document.querySelector('.close-button').addEventListener('click', closeAddActivityModal);
    window.addEventListener('click', outsideClick);
    document.getElementById('add-activity-form').addEventListener('submit', createActivity);
    document.getElementById('update-activity-button').addEventListener('click', showUpdateActivityModal);
    document.querySelector('.close-update-button').addEventListener('click', closeUpdateActivityModal);
    document.getElementById('update-activity-form').addEventListener('submit', updateActivity);
});


async function fetchActivities() {
    try {
        const response = await fetch(API_URL);
        console.log(response);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const activities = await response.json();
        displayActivities(activities);
    } catch (error) {
        console.error('Error fetching activities', error);
    }
}

 function displayActivities(activities) {
     const table = document.getElementById('activities-table');
     activities.forEach(activity => {
         const row = table.insertRow();
         row.insertCell(0).textContent = activity.id;
         row.insertCell(1).textContent = activity.name;
         row.insertCell(2).textContent = activity.description;
         row.insertCell(3).textContent = activity.pricePrPerson;
         row.insertCell(4).textContent = activity.timeMaxLimit;
         row.insertCell(5).textContent = activity.ageMin;
         row.insertCell(6).textContent = activity.ageMax;
         row.insertCell(7).textContent = activity.personsMin;
         row.insertCell(8).textContent = activity.personsMax;
         row.insertCell(9).textContent = activity.openingTime;
         row.insertCell(10).textContent = activity.closingTime;
         row.insertCell(11).textContent = activity.timeSlotInterval;

         row.addEventListener('click', () => {
             if (row.classList.contains('selected')) {
                 row.classList.remove('selected');
             } else {
                 const selectedRow = table.querySelector('.selected');
                 if (selectedRow) {
                     selectedRow.classList.remove('selected');
                 }
                 row.classList.add('selected');
             }
         });
     });
 }

     function showAddActivityModal() {
         document.getElementById('add-activity-modal').style.display = 'block';
     }

     function closeAddActivityModal() {
         document.getElementById('add-activity-modal').style.display = 'none';
     }

     function outsideClick(event) {
         if (event.target == document.getElementById('add-activity-modal')) {
             closeAddActivityModal();
         }
     }

     async function createActivity(event) {
         event.preventDefault();
         const name = document.getElementById('activity-name').value;
         const description = document.getElementById('activity-description').value;
         const pricePrPerson = document.getElementById('activity-price').value
         const timeMaxLimit = document.getElementById('activity-time-max-limit').value;
         const ageMin = document.getElementById('activity-age-min').value;
         const ageMax = document.getElementById('activity-age-max').value;
         const personsMin = document.getElementById('activity-persons-min').value;
         const personsMax = document.getElementById('activity-persons-max').value;
         const openingTime = document.getElementById('activity-opening-time').value;
         const closingTime = document.getElementById('activity-closing-time').value;
         const timeSlotInterval = document.getElementById('activity-time-slot-interval').value;

         // New equipment types
         const equipmentType1 = document.getElementById('equipment-type-1').value;
         const equipmentType2 = document.getElementById('equipment-type-2').value;
         const equipmentType3 = document.getElementById('equipment-type-3').value;

         const newActivity = {
             name,
             description,
             pricePrPerson,
             timeMaxLimit,
             ageMin,
             ageMax,
             personsMin,
             personsMax,
             openingTime,
             closingTime,
             timeSlotInterval,
             equipmentTypes: [equipmentType1, equipmentType2, equipmentType3] // Include equipment types
         };


         try {
             const response = await fetch(API_URL, {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json'
                 },
                 body: JSON.stringify(newActivity)
             });

             if (!response.ok) {
                 console.log('Error creating activity', response.status, errorText);
                 throw new Error('Network response was not ok');
             }

             const createdActivity = await response.json();
             displayActivities([createdActivity]);
             document.getElementById('add-activity-form').reset();
             closeAddActivityModal();
         } catch (error) {
             console.error('Error creating activity', error);
         }
}

async function deleteActivity() {
    const selectedRow = document.querySelector('.selected');
    if (!selectedRow) {
        alert('Please select an activity to delete.');
        return;
    }

    const activityId = selectedRow.cells[0].textContent;
    const activityName = selectedRow.cells[1].textContent;

    const confirmation = confirm(`Are you sure you want to delete the activity: ${activityName}?`);
    if (!confirmation) {
        return;
    }
    try {
        const response = await fetch(`${API_URL}/${activityId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        selectedRow.remove();
    } catch (error) {
        console.error('Error deleting activity', error);
    }
}

function showUpdateActivityModal() {
    const selectedRow = document.querySelector('.selected');
    if (!selectedRow) {
        alert('Please select an activity to update.');
        return;
    }

    // Populate the form with the selected activity's data
    document.getElementById('update-activity-name').value = selectedRow.cells[1].textContent;
    document.getElementById('update-activity-description').value = selectedRow.cells[2].textContent;
    document.getElementById('update-activity-price').value = selectedRow.cells[3].textContent;
    document.getElementById('update-activity-time-max-limit').value = selectedRow.cells[4].textContent;
    document.getElementById('update-activity-age-min').value = selectedRow.cells[5].textContent;
    document.getElementById('update-activity-age-max').value = selectedRow.cells[6].textContent;
    document.getElementById('update-activity-persons-min').value = selectedRow.cells[7].textContent;
    document.getElementById('update-activity-persons-max').value = selectedRow.cells[8].textContent;
    document.getElementById('update-activity-opening-time').value = selectedRow.cells[9].textContent;
    document.getElementById('update-activity-closing-time').value = selectedRow.cells[10].textContent;
    document.getElementById('update-activity-time-slot-interval').value = selectedRow.cells[11].textContent;


    document.getElementById('update-activity-modal').style.display = 'block';
}

function closeUpdateActivityModal() {
    document.getElementById('update-activity-modal').style.display = 'none';
}

async function updateActivity(event) {
    event.preventDefault();
    const selectedRow = document.querySelector('.selected');
    if (!selectedRow) {
        alert('Please select an activity to update.');
        return;
    }

    const activityId = selectedRow.cells[0]?.textContent;
    if (!activityId) {
        console.error('Activity ID not found');
        return;
    }

    const getElementValue = (id) => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Element with ID ${id} not found`);
            return '';
        }
        return element.value;
    };

    // Fetch the current equipment types from the selected row
    const currentEquipmentTypes = selectedRow.cells[12]?.textContent.split(', ') || [];

    const updatedActivity = {
        name: getElementValue('update-activity-name'),
        description: getElementValue('update-activity-description'),
        pricePrPerson: getElementValue('update-activity-price'),
        timeMaxLimit: getElementValue('update-activity-time-max-limit'),
        ageMin: getElementValue('update-activity-age-min'),
        ageMax: getElementValue('update-activity-age-max'),
        personsMin: getElementValue('update-activity-persons-min'),
        personsMax: getElementValue('update-activity-persons-max'),
        openingTime: getElementValue('update-activity-opening-time'),
        closingTime: getElementValue('update-activity-closing-time'),
        timeSlotInterval: getElementValue('update-activity-time-slot-interval'),
        equipmentTypes: selectedRow.cells[12]?.textContent.split(', ') || [] // Retain the old equipment types
    };

    try {
        const response = await fetch(`http://localhost:8080/Activity/${activityId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedActivity)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Update the table row with the new data
        selectedRow.cells[1].textContent = updatedActivity.name;
        selectedRow.cells[2].textContent = updatedActivity.description;
        selectedRow.cells[3].textContent = updatedActivity.pricePrPerson;
        selectedRow.cells[4].textContent = updatedActivity.timeMaxLimit;
        selectedRow.cells[5].textContent = updatedActivity.ageMin;
        selectedRow.cells[6].textContent = updatedActivity.ageMax;
        selectedRow.cells[7].textContent = updatedActivity.personsMin;
        selectedRow.cells[8].textContent = updatedActivity.personsMax;
        selectedRow.cells[9].textContent = updatedActivity.openingTime;
        selectedRow.cells[10].textContent = updatedActivity.closingTime;
        selectedRow.cells[11].textContent = updatedActivity.timeSlotInterval;
        selectedRow.cells[12].textContent = updatedActivity.equipmentTypes.join(', '); // Retain the old equipment types

        closeUpdateActivityModal();
    } catch (error) {
        console.error('Error updating activity', error);
    }
}