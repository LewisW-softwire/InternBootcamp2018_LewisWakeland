var request = require('request');

class busStop {
    constructor(name, stopLetter, code) {
      this.name = name;
      this.stopLetter = stopLetter;
      this.code = code;
    }
}

exports.getStopsFromPostcode = function(postcode) {
    return new Promise((resolve, reject) => {
        request(`http://api.postcodes.io/postcodes/${postcode}`,
            async function(error, response, body) {
                let geoData = JSON.parse(body);
                if(geoData.status === 200){ //Return a result if the postcode is valid
                    let latitude = geoData.result.latitude;
                    let longitude = geoData.result.longitude;
                    let busStops = [];
                    let radius = 200;
                    while(busStops.length<2 && radius < 5000){
                        closestStopsPromise = await getStopsFromLatLong(latitude, longitude, radius)
                        .then((val) => busStops = val)
                        .catch((err) => console.log("test"));
                        radius += 200;
                    }
                    resolve(busStops);
                }else{ //Pass on the error code if the request is invalid
                    reject(geoData.status);
                }
            }
        );
    });


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
                    let stop1 = new busStop(stopData.stopPoints[0].commonName, stopData.stopPoints[0].stopLetter, stopData.stopPoints[0].naptanId);
                    let stop2 = new busStop(stopData.stopPoints[1].commonName, stopData.stopPoints[1].stopLetter, stopData.stopPoints[1].naptanId);
                    resolve([stop1, stop2]);
                }
            }
        );
        });
        
    }

}

