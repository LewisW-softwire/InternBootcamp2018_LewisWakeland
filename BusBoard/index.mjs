var readline = require('readline-sync');
var request = require('request');
var moment = require('moment');
var Table = require('cli-table');
var geolocation = require('./geolocation.mjs');


let postcode = readline.question("Input postcode: ");
geolocation.getStopsFromPostcode(postcode);

let stopCode = readline.question("Input stop code: ");
request(`https://api.tfl.gov.uk/StopPoint/${stopCode}/Arrivals?app_id=ad55981b&app_key=cfbb21febb5756cf78e722fefc2d929b`,
    function(error, response, body) {
        let data = JSON.parse(body);
        let next5Busses = [];
        for(let i = 0; i < data.length; i++){
            let arrivalTime = moment(data[i].expectedArrival).unix();
            next5Busses.push([i, arrivalTime]);
        }
        next5Busses.sort( function(first, second) {
            return first[1] - second[1]
        });
        next5Busses = next5Busses.slice(0, 5);

        let outputData = []; //array of the next 5 busses and data to print
        for(let i = 0; i < 5; i++){
            let currentIndex = next5Busses[i][0]; //the index of the bus we want
            let lineName = data[currentIndex].lineName;
            let currentDestination = data[currentIndex].destinationName;
            let arrivalTime = moment( data[currentIndex].expectedArrival );
            outputData.push([lineName, currentDestination, arrivalTime.format('HH:mm:ss')]);
        }
        let busTimetable = new Table({head: ["Line Name", "Destination", "Arrival Time"]});
        busTimetable.push.apply(busTimetable, outputData);
        console.log(busTimetable.toString());
    });

