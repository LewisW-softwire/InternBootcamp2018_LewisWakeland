var readline = require('readline-sync');
var request = require('request');

let stopCode = readline.question("Input stop code: ");

request
    .get(`https://api.tfl.gov.uk/StopPoint/${stopCode}/Arrivals?app_id=ad55981b&app_key=cfbb21febb5756cf78e722fefc2d929b`)
    .on('response', function(response) {
        console.log(response);
        
    });