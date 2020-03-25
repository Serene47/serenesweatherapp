
app.factory("geoLocationservice",["$q","$window",function($q,$window){

    var geoLocationservice = {};

    geoLocationservice.getCurrentPosition = function(){

        var deferred = $q.defer();

        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          };

        if(!$window.navigator.geolocation){
            deferred.reject("Geolocation not supported in your browser.")
        }

        $window.navigator.geolocation.getCurrentPosition(
            function(position){
                deferred.resolve(position)
            },
            function(error){
                
                var message;

                switch(error.code){

                    case error.PERMISSION_DENIED :
                        message = "User denied the request for Geolocation.";
                        break;
                    case error.POSITION_UNAVAILABLE :
                        message = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT :
                        message = "The request to get user location timed out.";
                        break;
                    case error.UNKNOWN_ERROR :
                        message = "An unknown error occurred.";
                        break;
                }

                deferred.reject(message);
            },
            options
        )

        return deferred.promise;
    }

    return geoLocationservice;

}])