app.factory("localStorageService",["$window",function($window){

    var localStorageService = {};

    localStorageService.getFromLocalStorage = function(key){

        var data = $window.localStorage.getItem(key);

        return JSON.parse(data);

    }

    localStorageService.setToLocalStorage = function(key,data){

        data = JSON.stringify(data);

        $window.localStorage.setItem(key,data);

    }

    localStorageService.addLocation = function(location){

        var data = localStorageService.getFromLocalStorage("locations");

        if(data == null){

            data = [location]

        } else {

            var exist = data.some(function(loc){

                return loc.id == location.id;
            })
    
            if(!exist){
    
                data.push(location)
            }
        }

    
        localStorageService.setToLocalStorage("locations",data)

    }

    return localStorageService;




}]);