
console.log("Vi er i fetchURL.js");

const API_URL = 'http://localhost:8080/Activity';

document.addEventListener('DOMContentLoaded', () => {
    fetchActivities();
    document.getElementById('add-activity-button').addEventListener('click', showAddActivityModal);
    document.getElementById('delete-activity-button').addEventListener('click', deleteActivity);
    document.querySelector('.close-button').addEventListener('click', closeAddActivityModal);
    window.addEventListener('click', outsideClick);
    document.getElementById('add-activity-form').addEventListener('submit', createActivity);
});


async function fetchActivities() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network repsonse was not ok');
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
             timeSlotInterval
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

