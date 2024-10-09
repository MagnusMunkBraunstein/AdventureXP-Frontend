const urlGetActivities = "http://localhost:8080/Activity/types";

let activities = await fetch(urlGetActivities)
    .then(response => response.json())
    .then(data => {
        return data;
    });

var selActivity = document.getElementById("selActivity");


activities.forEach(function(activity){
    var option = document.createElement('option')

})

