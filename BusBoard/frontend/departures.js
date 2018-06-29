function showTimetable() {
    let postcode = document.getElementById('postcode').value;
    var xhttp = new XMLHttpRequest();
    console.log(postcode);
    xhttp.open('GET', `http://localhost:8080/departureBoards/${postcode}`, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onload = function() {
        // Handle response here using e.g. xhttp.status, xhttp.response, xhttp.responseText
        console.log(xhttp.response);
        let timetableData = JSON.parse(xhttp.response);
        let outputString = '<h2>Results</h2>\n';
        let [station1, station2] = Object.keys(timetableData);
        outputString = outputString + '<h3>' + station1 + '</h3>\n<ul>\n';
        for (i=0; i<timetableData[station1].length; i++) {
            let currentArrival = timetableData[station1][i];
            outputString = outputString + '<li>' +currentArrival.arrivalTime + currentArrival.lineName + currentArrival.destination + '</li>';
        }
        outputString += '</ul>';
        //2 minutes: 123 to Example Street

        document.getElementById("results").innerHTML = outputString;

    }

    xhttp.send();
    console.log('hello');
    
}