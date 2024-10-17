
const HOME_API_URL = '/api/'



// Redirect to pages
document.addEventListener('DOMContentLoaded', function() {
    fetchResponse();

    document.getElementById('season-button').addEventListener('click', function() {
        window.location.href = 'booking.html';
    });
    document.getElementById('admin-button').addEventListener('click', function() {
        window.location.href = 'admin.html';
    });
    document.getElementById('service-button').addEventListener('click', function() {
        window.location.href = 'serviceemployee.html';
    });
    document.getElementById('sales-button').addEventListener('click', function() {
        window.location.href = 'salesemployee.html';
    });
});



async function fetchResponse() {
    try {
        const response = await fetch(HOME_API_URL);
        console.log(response);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const home_message = await response.json();
        console.log(home_message);
        document.getElementById('js-response').textContent = home_message;


    } catch (error) {
        console.error('Error fetching activities', error);
    }
}