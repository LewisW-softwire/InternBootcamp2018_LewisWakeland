var readline = require('readline-sync');
var Table = require('cli-table');
var geolocation = require('./geolocation.mjs');
var tflBusses = require('./tflBusses.mjs');
class busStop {
    constructor(name, code) {
      this.name = name;
      this.code = code;
    }
}

let postcode = readline.question("Input postcode: ");
geolocation.getStopsFromPostcode(postcode).then( function (nearbyStops) {
    makeTimetable(nearbyStops[0]);
    makeTimetable(nearbyStops[1]);
});


function makeTimetable(busStop) {
    tflBusses.getTimetable(busStop.code).then(function (timetableData) {
        console.log(busStop.name);
        let busTimetable = new Table({ head: ["Line Name", "Destination", "Arrival Time"] });
        busTimetable.push.apply(busTimetable, timetableData);
        console.log(busTimetable.toString());
    });
}

