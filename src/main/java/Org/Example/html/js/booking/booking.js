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

// ------------------- CRUD Operations -------------------

// create
function createFormEventListener(){
    formBooking = document.getElementById("formBooking");
    formBooking.addEventListener("submit", handleCreateBooking);
}

async function handleCreateBooking(event){
    event.preventDefault();

    try{
        await handleResponse(await postFormDataAsJson(urlPostBooking, new FormData(event.currentTarget)));
    }catch (error){
        alert(error.message);
        console.log(error)
    }
}

async function postFormDataAsJson(url, formData) {
    const plainFormData = Object.fromEntries(formData.entries());
    console.log(plainFormData);

    // restructuring the activity property of plainFormData to an object with name property.
    plainFormData.activity = {name: plainFormData.activity};

    return await postObjectAsJson(url, plainFormData, "POST");

}

async function postObjectAsJson(url, object, httpVerb){
    const objectAsJsonString = JSON.stringify(object);
    console.log(objectAsJsonString);

    return await fetch(url, {
        method: httpVerb,
        headers: {
            "Content-Type": "application/json",
        },
        body: objectAsJsonString,
    });
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
    }
}