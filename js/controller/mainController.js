app.controller("mainController",["$scope","$http","weatherService","geoLocationservice","localStorageService",
                function($scope,$http,weatherService,geoLocationservice,localStorageService){
    
    $scope.weatherAvaliable = false;

    $scope.forecastAvaliable = false;
    
    $scope.noDataMessage = "Please select a city.";

    $scope.onlocationselect = function(locationDetails){

        try {

            $scope.weatherAvaliable = false;

            $scope.forecastAvaliable = false;

            $scope.noDataMessage = "Fetching weather information";

            weatherService.fetchCurrentWeather(locationDetails)
                .then(function(res){

                    var data = weatherService.extractCurrentWeatherData(res);

                    localStorageService.addLocation({id:data.main.cityId,name:data.main.cityName})

                    $scope.showWeather(data);

                })
                .catch(function(error){

                    $scope.weatherAvaliable = false;

                    $scope.noDataMessage = weatherService.createErrorMessage(error,locationDetails);
                });

            weatherService.fetchWeatherForecast(locationDetails,$scope.showForecast)
                .then(function(res){

                    var data = weatherService.extractForecastData(res);

                    $scope.showForecast(data);

                })
                .catch(function(error){

                    $scope.forecastAvaliable = false;

                    $scope.noDataMessage = weatherService.createErrorMessage(error,locationDetails);
                });

        } catch(e) {
            console.log(e)
        }
    }

    $scope.showWeather = function(data){

        try {

            $scope.weatherAvaliable = true;

            $scope.weatherData = data;

        } catch(e) {
            console.log(e)
        }
    }

    $scope.showForecast = function(data){

        try {

            $scope.forecastAvaliable = true;

            $scope.forecastData = data;

            $scope.forecastDate = data.minDate;

        } catch(e) {
            console.log(e)
        }
        

    }

    $scope.changeForecastDate = function(date){

        try {

            $scope.forecastDate = date;

        } catch(e) {
            console.log(e)
        }
    }

    $scope.useCurrentLocation = function(){

        try {

            geoLocationservice.getCurrentPosition()
                .then(function(position){

                    var locationDetails = {
                        lat : position.coords.latitude,
                        lon : position.coords.longitude,
                        type : "geography"
                    }

                    $scope.onlocationselect(locationDetails);


                })
                .catch(function(error){
                    
                    $scope.weatherAvaliable = false;

                    $scope.forecastAvaliable = false;

                    $scope.noDataMessage = error;

                });

        } catch(e) {
            console.log(e)
        }

    }




}])