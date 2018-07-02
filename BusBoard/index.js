var Table = require('cli-table');
var geolocation = require('./geolocation.js');
var tflBusses = require('./tflBusses.js');
var express = require('express');

const app = express();
app.get("/departureBoards/:postcode", function(req, res ){
    let postcode = req.params.postcode;
    geolocation.getStopsFromPostcode(postcode)
    .then( function (nearbyStops) {
        let response = [];
        if(nearbyStops.length == 0){
            res.status(400).send("Error 400: No stop within 5km, consider moving to London.");
        }else{
            makeTimetable(nearbyStops[0]).then(function(timetable1){
                makeTimetable(nearbyStops[1]).then(function(timetable2){
                    response[0] = timetable1;
                    response[1] = timetable2;
                    res.send(response);
                });
            });
        }
    })
    .catch(function(err){
        res.status(err).send("Error " + err + ": This most likely means the postcode you entered is not correct.");
    });
    


    function makeTimetable(busStop) {
        return new Promise((resolve, reject) => {
            tflBusses.getTimetable(busStop.code).then(function (timetableData) {
                let busTimetable = new Table({ head: ["Line Name", "Destination", "Arrival Time"] });
                busTimetable.push.apply(busTimetable, timetableData);
                resolve({name: busStop.name, stopLetter: busStop.stopLetter, data: timetableData});
            });
        });
    }

});
app.use(express.static('frontend'));
app.listen(8080, () => console.log("Listening on port 8080"));


