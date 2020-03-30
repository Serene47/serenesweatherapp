app.factory("weatherService",["$http",function($http){


    var weatherService = {}
    
    weatherService.apiKey ="01a5c660cd8f74579ab8ac0122b4b9c1";

    weatherService.buildUrl =function(locationDetails,urltype){

        var url;

        if(urltype == "current"){

            url = "https://api.openweathermap.org/data/2.5/weather?";

        } else if(urltype == "forecast"){

            url = "https://api.openweathermap.org/data/2.5/forecast?";
        }


        switch(locationDetails.type){

            case "name" :

                url = url + "q="+ locationDetails.name;

                break;
            
            case "id"   :

                url = url + "id="+ locationDetails.id;

                break;

            case "geography":

                url = url + "lat="+ locationDetails.lat + "&lon=" + locationDetails.lon;

                break;

        }

        url = url + "&units=metric&appid=" + weatherService.apiKey;

        return url;

    }


    weatherService.fetchCurrentWeather = function(locationDetails){

        var url = weatherService.buildUrl(locationDetails,"current");

        return $http.get(url);         

    }


    weatherService.extractCurrentWeatherData  = function(response){

        var data = response.data;

        var weatherData = {};

        weatherData.main = {},weatherData.additional = {};

        weatherData.main.cityName = data.name;

        weatherData.main.cityId = data.id;

        //to update later
        weatherData.main.iconClass = ['owi','owi-' + data.weather[0].icon ];

        weatherData.main.temperature = data.main.temp;

        weatherData.main.condition = data.weather[0].main;

        weatherData.main.description = data.weather[0].description;
        
        var instance = new Date(data.dt * 1000);

        weatherData.main.lastUpdated = instance.toLocaleDateString('en-IN') + " " +
                                        instance.toLocaleTimeString('en-US',{timeStyle : "short"});

        //additional data 
        weatherData.additional.pressure = data.main.pressure;

        weatherData.additional.humidity = data.main.humidity;

        weatherData.additional.wind = {};

        weatherData.additional.wind.speed  = data.wind.speed;

        weatherData.additional.wind.degree  = data.wind.deg;

        weatherData.additional.clouds = data.clouds.all;


        return weatherData;

    }


    weatherService.fetchWeatherForecast = function(locationDetails,callback){

        var url = weatherService.buildUrl(locationDetails,"forecast");

        return $http.get(url);

    }

    weatherService.extractForecastData = function(response){

        var data = response.data;

        var weatherData = {};

        weatherData.forecastDates = [],weatherData.forecastData = {};

        var weekdays = ["Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday"]

        var today = new Date();

        var tommorow = new Date(new Date().setDate(today.getDate() + 1))
                                .toLocaleDateString();

        var today = today.toLocaleDateString();

        data.list.forEach(function(forecast,index){

            var date = new Date(forecast.dt * 1000);

            var dateString = date.toLocaleDateString();

            var dateName = "";

            if(dateString == today){
                dateName = "Today";
            } else if(dateString == tommorow){
                dateName = "Tommorow";
            } else {
                dateName = weekdays[date.getDay()];
            }


            if(weatherData.forecastData[dateString]){

                weatherData.forecastData[dateString].push({
                    time :  new Date(forecast.dt * 1000).toLocaleTimeString('en-US',{timeStyle : "short"}),
                    iconClass : ['owi','owi-' + forecast.weather[0].icon ],
                    condition : forecast.weather[0].main,
                    temperature : forecast.main.temp
                });
                
            } else {

                weatherData.forecastDates.push({
                    value : dateString,
                    name : dateName
                })

                weatherData.forecastData[dateString] = [{
                    time :  new Date(forecast.dt * 1000).toLocaleTimeString('en-US',{timeStyle : "short"}),
                    iconClass : ['owi','owi-' + forecast.weather[0].icon ],
                    condition : forecast.weather[0].main,
                    temperature : forecast.main.temp
                }];

                if(index == 0){
                    weatherData.minDate = dateString;
                }
            }

           

        })

        return weatherData;

    }

    weatherService.createErrorMessage = function(error,locationDetails){

        console.log(error)

        var errorMesssage = "";

        var code = error.data ? error.data.cod : "";

        switch(code){

            case "404" :

                if(locationDetails.type == "name"){
                    errorMesssage = "No information available for the city " + locationDetails.name;
                } else {
                    errorMesssage = "No information available for your current location";
                }

                break;

            default : 
                errorMesssage = "Coudn't fetch weather information";
                break;

        }

        return errorMesssage;


    }

    return weatherService;


}])