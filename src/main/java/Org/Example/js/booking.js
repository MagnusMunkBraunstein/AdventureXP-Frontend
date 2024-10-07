const urlPostBooking = "http://localhost:8080/booking";

document.addEventListener("DOMContentLoaded", createFormEventListener);
let formBooking;

function createFormEventListener(){
    formBooking = document.getElementById("formBooking");
    formBooking.addEventListener("submit", handleFormSubmit);
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