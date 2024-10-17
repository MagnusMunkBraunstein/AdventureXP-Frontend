const urlGetActivities = "/api/Activity";

async function fetchActivitiesAndFillDropdown() {
    let activities = await fetch(urlGetActivities)
        .then(response => response.json())
        .then(data => {
            return data;
        });

    var selActivity = document.getElementById("selActivity");


    activities.forEach(function(activity){
        var option = document.createElement('option')
        option.value = activity.id;
        option.text = activity.name;
        selActivity.add(option);
    });
}

document.getElementById('createBookingBtn').addEventListener('click', fetchActivitiesAndFillDropdown);

