const urlPostBooking = "http://localhost:8080/booking";
const urlGetBookings = "http://localhost:8080/booking";
const urlDeleteBooking = "http://localhost:8080/booking";
const urlGetAvailableTimeslots = "http://localhost:8080/booking/available-timeslots";

document.addEventListener("DOMContentLoaded", function () {
    createFormEventListener();
    loadBookings(); // Automatically load bookings on page load

    const modal = document.getElementById("bookingModal")
    const createBookingBtn = document.getElementById("createBookingBtn");
    const closeModalbtn = document.querySelector(".close");
    const deleteBookingBtn = document.getElementById("deleteBookingBtn");
    const selActivity = document.getElementById("selActivity");
    const fixedDate = document.getElementById("fixedDate");

    createBookingBtn.addEventListener("click", function () {
        modal.style.display = "block";
    });

    closeModalbtn.addEventListener("click", function (){
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event){
        if (event.target === modal){
            modal.style.display = "none";
        }
    });

    deleteBookingBtn.addEventListener("click", function (){
        if (selectedBookingId){
            deleteBooking(selectedBookingId).then(r => console.log(r));
        }
    });
    fixedDate.addEventListener("change", fetchAvailableTimeslots);
    selActivity.addEventListener("change", fetchAvailableTimeslots)
});

// ------------------- CRUD Operations -------------------

// create
function createFormEventListener(){
    formBooking = document.getElementById("formBooking");
    formBooking.addEventListener("submit", handleCreateBooking);
}

async function handleCreateBooking(event) {
    event.preventDefault();  // Prevent default form submission

    // Make the POST request to create the booking
    try {
        // Handle the response
        await handleResponse(await getResponse(getBookingData(event)));

    } catch (error) {
        console.error('Error:', error);
        alert('Error creating booking: ' + error.message);
    }
}


// delete
async function deleteBooking(bookingId){
    try{
        const response = await fetch(`${urlDeleteBooking}/${bookingId}`,{
            method: "DELETE",
        });

        if (response.ok){
            alert("Booking deleted");
            loadBookings();
        }else {
            alert("Failed to delete booking");
        }
    }catch (error){
        console.error("Error deleting booking", error);
        alert("Failed to delete booking");
    }
}

// read
async function fetchAvailableTimeslots(){
    const selectedActivity = selActivity.value;
    const selectedDate = fixedDate.value;
    const personsAmount = document.getElementById("inpPersonsAmount").value;

    const timeslotsContainer = document.getElementById("timeslots");
    timeslotsContainer.innerHTML = '';

    if (selectedActivity && selectedDate && personsAmount){
        try{
            const response = await fetch(`${urlGetAvailableTimeslots}?activityId=${selectedActivity}&date=${selectedDate}&personsAmount=${personsAmount}`);
            const data = await response.json();

            if(response.ok){
                if (data.length > 0){
                    data.forEach(slot => {
                        const slotElement = document.createElement("div");
                        slotElement.className = "timeslot";
                        slotElement.textContent = `${slot.startTime} - ${slot.endTime}`;
                        slotElement.dataset.startTime = slot.startTime;
                        slotElement.dataset.endTime = slot.endTime;
                        slotElement.dataset.timeslotId = slot.id;

                        slotElement.onclick = function () {
                            document.querySelectorAll('.timeslot').forEach(el => el.classList.remove('selected'));
                            slotElement.classList.add('selected');
                            document.getElementById('inpStartTime').value = slot.startTime;
                            document.getElementById('inpEndTime').value = slot.endTime;
                            document.getElementById('timeslotId').value = slot.id;


                        };
                        timeslotsContainer.appendChild(slotElement);

                    });
                }else{
                    timeslotsContainer.innerHTML = '<div>No available timeslots</div>';
                }
            }else{
                timeslotsContainer.innerHTML ='<div>Error fetching timeslots</div>'
                console.error('Error fetching timeslots', data);
            }
        }catch (error){
            console.error('Error fetching timeslots', error);
            timeslotsContainer.innerHTML = '<div>Error fetching timeslots</div>'
        }
    }
}

// ------------------- Helper methods -------------------


async function loadBookings(){
    try{
        const response = await fetch(urlGetBookings);
        const bookings = await response.json();

        const bookingTableBody = document.querySelector("#bookingsTable tbody");
        bookingTableBody.innerHTML = "";
        selectedBookingId = null;
        document.getElementById("deleteBookingBtn").disabled = true;

        bookings.forEach(booking => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${booking.id}</td>
                <td>${booking.activity.name}</td>
                <td>${booking.date}</td>
                <td>${booking.participantName}</td>
                <td>${booking.startTime}</td>
                <td>${booking.endTime}</td>
                <td>${booking.personsAmount}</td>
            `;

            row.addEventListener("click",function (){
                selectBooking(row,booking.id);
            })

            bookingTableBody.appendChild(row);
        });
    }catch (error){
        console.error("error loading bookings", error);
        alert("failed to load bookings");
    }
}

function selectBooking(row, bookingId){
    const previouslySelected = document.querySelector(".selected");
    if (previouslySelected){
        previouslySelected.classList.remove("selected");
    }

    row.classList.add("selected");
    selectedBookingId = bookingId;
    document.getElementById("deleteBookingBtn").disabled = false;
}

async function handleResponse(response) {
    if (!response.ok) {
        const errorMessage = await response.text();
        console.log(errorMessage);
        alert(errorMessage);
    } else {
        alert("Booking successfully created");
        loadBookings();
        document.getElementById("bookingModal").style.display = "none";
        formBooking.reset();
        document.getElementById("timeslots").innerHTML = '';
    }

}


// ------ get helper methods ---

function getBookingData(event) {
    // Get the form data
    const formData = new FormData(event.target);

    // Create the booking data from the form
    const bookingData = {
        activity: {id: formData.get('activity')},
        booking: {
            date: formData.get('date'),
            personsAmount: formData.get('personsAmount'),
            participantName: formData.get('participantName'),
            startTime: formData.get('startTime'),
            endTime: formData.get('endTime'),
            activity: {id: formData.get('activity')}
        },
        timeslot: {
            timeslotId: formData.get('timeslotId')
        }
    };

    // Debugging: Show booking data
    console.log('Booking Data:', bookingData);  // Use console for better debugging
    return bookingData;
}

async function getResponse(bookingData) {
    return await fetch(urlPostBooking, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(bookingData)  // Convert the booking data to JSON string
    });
}