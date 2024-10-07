console.log("Im in equipmentservice.js");

document.addEventListener("DOMContentLoaded", function () {

    // Fetch data from the backend getmapping
    fetch('http://localhost:8080/api/equipment/all')
        .then(response => response.json())
        .then(data => {

            // Filter the equipment to get eqipment non functional
            const nonFunctionalEquipment = data.filter(equipment => !equipment.functional);

            //repeat and show table
            function renderNonFunctionalEquipment(equipmentList) {
                const tableBody = document.querySelector('#equipmentTable tbody');
                tableBody.innerHTML = '';


                equipmentList.forEach(equipment => {
                    const row = document.createElement('tr');

                    // Create table cells
                    const nameCell = document.createElement('td');
                    nameCell.textContent = equipment.name;

                    const functionalCell = document.createElement('td');
                    functionalCell.textContent = 'No';

                    const serviceCell = document.createElement('td');
                    serviceCell.textContent = equipment.underService ? 'Yes' : 'No';

                    const actionCell = document.createElement('td');
                    const markAsFunctionalButton = document.createElement('button');
                    markAsFunctionalButton.textContent = 'Mark as Functional';


                    markAsFunctionalButton.addEventListener('click', function () {
                        fetch(`http://localhost:8080/api/equipment/mark-functional/${equipment.id}`, {  // Full URL for our put request inthe controller
                            method: 'PUT'
                        })
                            .then(response => {
                                if (response.ok) {
                                    alert('Equipment is now marked as functional');
                                    location.reload();
                                } else {
                                    alert('Something went wrong setting the equipment to functionals');
                                }
                            })
                            .catch(error => {
                                console.error('Error 404 in marking equipment as functional:', error);
                            });
                    });

                    actionCell.appendChild(markAsFunctionalButton);

                    row.appendChild(nameCell);
                    row.appendChild(functionalCell);
                    row.appendChild(serviceCell);
                    row.appendChild(actionCell);

                    tableBody.appendChild(row);
                });
            }

            renderNonFunctionalEquipment(nonFunctionalEquipment);
        })
        .catch(error => {
            console.error('Error in equipmentservice.js:', error);
        });
});