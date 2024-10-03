console.log("Im in equipmentservice.js");


document.addEventListener("DOMContentLoaded", function () {

    //Here we are going to fetch data from the backend
    fetch('http://localhost:8080/equipment')
    .then(response => response.json())
    .then(data => {


        // Here we filter the equipment
        const nonFunctionalEquipment = data.filter(equipment => !equipment.functional);

        // here we render the table of non functional eqiupment
        function renderNonFunctionalEquipment(equimentlist) {
            const tableBody = document.querySelector('#equipmentTable tbody');
            tableBody.innerHTML = '';

            // now we loop through filtered equipment and create the table rows i need

            equimentlist.forEach(equipment => {

                const row = document.createElement('tr');

                const namecell = row.getElementsByTagName('td');
                namecell.textContent = equipment.name;

                const functioncell = row.getElementsByTagName('td');
                functioncell.textContent = ('no');

                const serviceCell = document.createElement('td');
                serviceCell.textContent = equipment.underService ? 'Yes' : 'No';

                const actionCell = document.createElement('td');
                const markAsFunctionalButton = document.createElement('button')
                markAsFunctionalButton.textContent = 'Mark as Functional';


                markAsFunctionalButton.addEventListener('click', function () {
                    fetch(`/api/equipment/mark-functional/${equipment.id}`, {
                        method: 'PUT'
                })
                    .then(response =>{
                        if (response.ok) {
                            alert('Equipment marked as fuctional')
                            location.reload();
                        }
                        else {
                            alert('Something went wrong setting the equipmet to functional');
                        }
                    });
                });


                actionCell.appendChild(markAsFunctionalButton);

                // here the cells is getting appended to the row

                row.appendChild(namecell);
                row.appendChild(functioncell);
                row.appendChild(serviceCell);
                row.appendChild(actionCell);

                // now we append the row to the table body
                tableBody.appendChild(row);

            })
        }
        //render the tabel with filteredd equipment
        renderNonFunctionalEquipment(nonFunctionalEquipment)
    })
        .catch(error =>{
            console.error('error in equipmentservice.js', error);
        })
})