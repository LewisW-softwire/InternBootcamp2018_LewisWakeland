function showTimetable() {
    let postcode = document.getElementById('postcode').value;
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', `http://localhost:8080/departureBoards/${postcode}`, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onload = function() {
        // Handle response from our API
        console.log(xhttp.response);
        var outputString = "";
        if(xhttp.status !== 200){
            outputString = `<p>${xhttp.response}</p>`;
        }else{
            let timetableData = JSON.parse(xhttp.response);
            outputString = '<h2>Results</h2>\n';
            let stations = Object.keys(timetableData);
            for(let j = 0; j<stations.length; j++){
                outputString += `<h3>${stations[j]}</h3>\n`;
                outputString += '<table>\n';
                outputString += '<tr>\n';
                outputString += `<th>Line Name</th>\n`;
                outputString += `<th>Arrival Time</th>\n`;
                outputString += `<th>Destination</th>\n`;
                outputString += '</tr>\n';
    
                for (i=0; i<timetableData[stations[j]].length; i++) {
                    let currentArrival = timetableData[stations[j]][i];
                    outputString += '<tr>\n';
                    outputString += `<td>${currentArrival.lineName}</td>\n`;
                    outputString += `<td>${currentArrival.arrivalTime}</td>\n`;
                    outputString += `<td>${currentArrival.destination}</td>\n`;
                    outputString += '</tr>\n';
                }
                outputString += '</table>';
            }
        }

        document.getElementById("results").innerHTML = outputString;

    }

    xhttp.send();
    
}