var readline = require('readline-sync');
var request = require('request');
var moment = require('moment');
var Table = require('cli-table');

let stopCode = readline.question("Input stop code: ");

request(`https://api.tfl.gov.uk/StopPoint/${stopCode}/Arrivals?app_id=ad55981b&app_key=cfbb21febb5756cf78e722fefc2d929b`,
    function(error, response, body) {
        let data = JSON.parse(body);
        let next5Busses = [];
        for(let i = 0; i < data.length; i++){
            let arrivalTime = moment(data[i].expectedArrival).unix();
            next5Busses.push([i, arrivalTime]);
            console.log(arrivalTime);
            /*for( (key, value) in next5Busses){
                console.log(value);
            }*/  
        }
        next5Busses.sort( function(first, second) {
            return first[1] - second[1]
        });
        next5Busses = next5Busses.slice(0, 5);

        for(let i = 0; i < 5; i++){
            let currentIndex = next5Busses[i][0]; //the index of the bus we want
            let currentDestination = data[currentIndex].destinationName;
            let lineName = data[currentIndex].lineName;
            let arrivalTime = data[currentIndex].expectedArrival;
            console.log(currentDestination);
            console.log(lineName);
            console.log(arrivalTime);

        }
        
    });