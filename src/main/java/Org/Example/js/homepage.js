
// Redirect to pages
document.addEventListener('DOMContentLoaded', function() {
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
