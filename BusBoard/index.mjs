var Table = require('cli-table');
var geolocation = require('./geolocation.mjs');
var tflBusses = require('./tflBusses.mjs');
var express = require('express');

class busArrival{
    constructor(lineName, destination, arrivalTime){
        this.lineName = lineName;
        this.destination = destination;
        this.arrivalTime = arrivalTime;
    }
}

const app = express();
app.get("/departureBoards/:postcode", function(req, res ){
    let postcode = req.params.postcode;
    geolocation.getStopsFromPostcode(postcode).then( function (nearbyStops) {
        let response = {};
        if(nearbyStops.length == 0){
            res.status(400).send("Error 400: No stop within 5km, consider moving to London.");
        }else{
            makeTimetable(nearbyStops[0]).then(function([name1, stop1]){
                makeTimetable(nearbyStops[1]).then(function([name2, stop2]){
                    response[name1] = stop1;
                    response[name2] = stop2;
                    res.send(response);
                });
            });
        }
    });


    function makeTimetable(busStop) {
        return new Promise((resolve, reject) => {
            tflBusses.getTimetable(busStop.code).then(function (timetableData) {
                let busTimetable = new Table({ head: ["Line Name", "Destination", "Arrival Time"] });
                busTimetable.push.apply(busTimetable, timetableData);
                resolve([busStop.name, timetableData]);
            });
        });
    }

});
app.listen(8080, () => console.log("Listening on port 8080"));


