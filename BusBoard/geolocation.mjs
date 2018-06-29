var readline = require('readline-sync');
var request = require('request');

exports.getStopsFromPostcode = function(postcode) {
    request(`http://api.postcodes.io/postcodes/${postcode}`,
        async function(error, response, body) {
            let geoData = JSON.parse(body); 
            let latitude = geoData.result.latitude;
            let longitude = geoData.result.longitude;
            let closestStops = [];
            let radius = 10;
            while(closestStops.length<2 && radius < 85000){
                closestStopsPromise = await getStopsFromLatLong(latitude, longitude, radius)
                .then((val) => closestStops = val)
                .catch((err) => console.log("test"));
                
                radius += 200;
            }
            console.log(closestStops);
            
        }
    );

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
                    var closestStopCodes = [stopData.stopPoints[0].stationNaptan, stopData.stopPoints[1].stationNaptan];
                    resolve(closestStopCodes);
                }
            }
        );
        });
        
    }

}

