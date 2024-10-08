const urlPostBooking = "http://localhost:8080/booking";
const urlGetBookings = "http://localhost:8080/booking";
const urlDeleteBooking = "http://localhost:8080/booking";

document.addEventListener("DOMContentLoaded", function () {
    createFormEventListener();
    loadBookings(); // Automatically load bookings on page load

    const modal = document.getElementById("bookingModal")
    const createBookingBtn = document.getElementById("createBookingBtn");
    const closeModalbtn = document.querySelector(".close");
    let deleteBookingBtn = document.getElementById("deleteBookingBtn");

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
    })
});

function createFormEventListener(){
    formBooking = document.getElementById("formBooking");
    formBooking.addEventListener("submit", handleFormSubmit);
}

function setCurrentDate() {
    const dateInput = document.getElementById('inpDate');
    const today = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format
    dateInput.value = today;
}

async function postObjectAsJson(url, object, httpVerb){
    const objectAsJsonString = JSON.stringify(object);
    console.log(objectAsJsonString);

    const fetchOptions = {
        method: httpVerb,
        headers: {
            "Content-Type": "application/json",
        },
        body: objectAsJsonString,
    };

    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
        const errorMessage = await response.text();
        console.log(errorMessage);
        throw new error(errorMessage);
    }
    return response;
}

async function postFormDataAsJson(url, formData){
    const plainFormData = Object.fromEntries(formData.entries());
    console.log(plainFormData);

    plainFormData.activity = {name: plainFormData.activity};

    const response = await postObjectAsJson(url, plainFormData, "POST");
    if (!response.ok) {
        const errorMessage = await response.text();
        console.log(errorMessage);
        alert(errorMessage);
    }else{
        alert("Booking successfully created");
        loadBookings();
        document.getElementById("bookingModal").style.display = "none";
        formBooking.reset();
    }
}

async function handleFormSubmit(event){
    event.preventDefault();
    const form = event.currentTarget;
    const url = urlPostBooking;

    try{
        const formData = new FormData(form)
        console.log(formData);
        const responseData = await postFormDataAsJson(url, formData);
    }catch (error){
        alert(error.message);
        console.log(error)
    }
}
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