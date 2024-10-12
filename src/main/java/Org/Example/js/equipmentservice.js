console.log("Im in equipmentservice.js");

console.log("I'm in equipment.js");

console.log("I'm in equipmentservice.js");

// Constants
const API_BASE_URL = 'http://localhost:8080/equipment';
const PUT_URL = 'http://localhost:8080/equipment/mark-functional/';
const tableBody = document.querySelector('#equipmentTable tbody');

// Log tableBody to make sure it's correctly selected
console.log(tableBody);
if (!tableBody) {
    console.error("Table body not found!");
}

// Fetch data from the backend
document.addEventListener("DOMContentLoaded", function () {
    fetchEquipmentData();
});

// Fetch all equipment data
function fetchEquipmentData() {
    fetch(API_BASE_URL)
        .then(response => {
            console.log('Response received:', response);  // Log the raw response
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);  // Log the parsed data
            const nonFunctionalEquipment = filterNonFunctionalEquipment(data);
            renderNonFunctionalEquipment(nonFunctionalEquipment);
        })
        .catch(error => {
            console.error('Error fetching equipment data:', error);
        });
}

// Filter non-functional equipment
function filterNonFunctionalEquipment(equipmentList) {
     equipmentList.filter(equipment => !equipment.functional);
     console.log('Non-functional equipment:', equipmentList);
     return equipmentList;
}

// Render the non-functional equipment in the table
function renderNonFunctionalEquipment(equipmentList) {
    console.log('Rendering equipment list:', equipmentList);  // Log the equipment list
    tableBody.innerHTML = '';  // Clear existing table rows

    if (equipmentList.length === 0) {
        console.log("No non-functional equipment found.");
        tableBody.innerHTML = '<tr><td colspan="4">No non-functional equipment available</td></tr>';
        return;
    }

    equipmentList.forEach(equipment => {
        const row = document.createElement('tr');

        const nameCell = createTableCell(equipment.name);
        const functionalCell = createTableCell('No');  // Non-functional equipment
        const serviceCell = createTableCell(equipment.underService ? 'Yes' : 'No');
        const actionCell = createActionCell(equipment);

        row.appendChild(nameCell);
        row.appendChild(functionalCell);
        row.appendChild(serviceCell);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}

// Create a table cell
function createTableCell(content) {
    const cell = document.createElement('td');
    cell.textContent = content;
    return cell;
}

// Create the action cell with the Mark as Functional button
function createActionCell(equipment) {
    const actionCell = document.createElement('td');
    const markAsFunctionalButton = document.createElement('button');
    markAsFunctionalButton.textContent = 'Mark as Functional';

    // Add event listener for marking as functional
    markAsFunctionalButton.addEventListener('click', function () {
        markEquipmentAsFunctional(equipment);
    });

    actionCell.appendChild(markAsFunctionalButton);
    return actionCell;
}

// Mark equipment as functional
function markEquipmentAsFunctional(equipment) {
    fetch(`${PUT_URL}${equipment.id}`, {
        method: 'PUT'
    })
        .then(response => {
            if (response.ok) {
                alert('Equipment is now marked as functional');
                // Re-fetch and re-render the list instead of reloading the whole page
                fetchEquipmentData();  // Re-fetch and re-render the data
            } else {
                alert('Failed to mark equipment as functional');
            }
        })
        .catch(error => {
            console.error('Error marking equipment as functional:', error);
        });
}
