var request = require('request');
var moment = require('moment');

class busArrival{
    constructor(lineName, destination, arrivalTime){
        this.lineName = lineName;
        this.destination = destination;
        this.arrivalTime = arrivalTime;
    }
}

exports.getTimetable = function(stopCode) {
    return new Promise((resolve, reject) => {
        request(`https://api.tfl.gov.uk/StopPoint/${stopCode}/Arrivals?app_id=ad55981b&app_key=cfbb21febb5756cf78e722fefc2d929b`, function (error, response, body) {
            let data = JSON.parse(body);
            let next5Busses = [];
            for (let i = 0; i < data.length; i++) {
                let arrivalTime = moment(data[i].expectedArrival).unix();
                next5Busses.push([i, arrivalTime]);
            }
            next5Busses.sort(function (first, second) {
                return first[1] - second[1];
            });
            next5Busses = next5Busses.slice(0, 5);
            let outputData = []; //array of the next 5 busses and data to print
            for (let i = 0; i < Math.min(5, next5Busses.length); i++) {
                let currentIndex = next5Busses[i][0]; //the index of the bus we want
                let lineName = data[currentIndex].lineName;
                let currentDestination = data[currentIndex].destinationName;
                let arrivalTime = moment(data[currentIndex].expectedArrival);
                outputData.push(new busArrival(lineName, currentDestination, arrivalTime.format('HH:mm:ss')));
            }
            resolve(outputData);
        });
    });
}