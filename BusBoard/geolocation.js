var request = require('request');

class busStop {
    constructor(name, code) {
      this.name = name;
      this.code = code;
    }
}

exports.getStopsFromPostcode = function(postcode) {
    return new Promise((resolve, reject) => {
        latLongPromise = getLatLongFromPostcode(postcode);
        latLongPromise
        .then( async function (coordinates) {
            let busStops = [];
            console.log('foo');
            console.log(typeof(coordinates));
            let latitude = coordinates[0];
            let longitude = coordinates[1];
            console.log(latitude);
            console.log(longitude);
            let radius = 200;
            while(busStops.length<2 && radius < 5000){
                closestStopsPromise = await getStopsFromLatLong(latitude, longitude, radius)
                .then((val) => busStops = val)
                .catch((err) => console.log("test"));
                radius += 200;
            }
            resolve(busStops);
            console.log(busStops)
        })
        .catch(function(err){
            reject(err);
        });
    });
}


    //function GetStops(latitude, longitude, radius) {
    //    getStopsFromLatLong(latitude, longitude, radius).then((val) => { if (val.length < 2) { this.GetStops(radius + 200) }  })
    //}

    function getStopsFromLatLong(latitude, longitude, radius){
        const url = `https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&radius=${radius}&useStopPointHierarchy=false&modes=bus&returnLines=false&lat=${latitude}&lon=${longitude}`;
        return new Promise((resolve, reject) => {
            request.get(url, (error, response, body) => {
                if (error) {
                    reject();
                }
                let stopData = JSON.parse(body);
                
                if(stopData.stopPoints.length<2){
                    resolve([]);
                }else{
                    let stop1 = new busStop(stopData.stopPoints[0].commonName, stopData.stopPoints[0].naptanId);
                    let stop2 = new busStop(stopData.stopPoints[1].commonName, stopData.stopPoints[1].naptanId);
                    resolve([stop1, stop2]);
                }
            }
        );
        });  
    }

getLatLongFromPostcode = function(postcode) {
    return new Promise((resolve, reject) => {
        request(`http://api.postcodes.io/postcodes/${postcode}`,
            async function(error, response, body) {
                let geoData = JSON.parse(body);
                if(geoData.status === 200){ //Return a result if the postcode is valid
                    let latitude = geoData.result.latitude;
                    let longitude = geoData.result.longitude;
                    resolve([latitude, longitude]);
                }else{ //Pass on the error code if the request is invalid
                    reject(geoData.status);
                }
            }
        );
    });
}