app.directive("autocomplete",["localStorageService",function(localStorageService){

    return {
        restrict : 'E',
        template : '<div id="locationInput">' +
                        '<input type="text" ng-model="search" name="city" autocomplete="off" placeholder="Enter City" ng-change="onInputChange()" >' +
                        '<button ng-disabled="search.length < 3" ng-click="onLocationSubmit()" ><i class="fas fa-check"></i></button>' + 
                        '<ul class="suggestions" >'+
                            '<li ng-repeat="suggestion in suggestions" ng-click="onSuggestionSelect(suggestion)">{{suggestion.name}}</li>' +
                        '</ul>'+
                    '</div>',
        scope : {
            onlocationselect : "&"
        },
        controller : function($scope,$element,$attrs){

            $scope.search ="";

            $scope.onInputChange = function(){

                if(!$scope.search) {

                    $scope.suggestions  =   [];

                } else {

                    var locations = localStorageService
                                    .getFromLocalStorage("locations") || [];

                    var total = 0;

                    $scope.suggestions  =  locations.filter(function(location){

                        var result = location.name.toLowerCase().includes($scope.search.toLowerCase())

                        if(result){
                            total = total + 1;
                        }

                        return result && total <= 5;
                        
                    }).sort(function(loc1,loc2){
                        
                        var locName1 = loc1.name.toLowerCase(),locName2 = loc2.name.toLowerCase();

                        if(locName1 < locName2)
                            return -1;
                        if(locName1 > locName2)    
                            return 1;
                        return 0

                    }) 

                }
            }

            $scope.onSuggestionSelect = function(suggestion){

                var param = {
                    locationDetails : {id:suggestion.id,type:"id"}
                }

                $scope.onlocationselect(param)

                $scope.suggestions  =   [];

                $scope.search = "";

            }

            $scope.onLocationSubmit = function(){

                var param = {
                    locationDetails : {name:$scope.search,type:"name"}
                }

                $scope.onlocationselect(param)

                $scope.suggestions  =   [];

                $scope.search = "";

            }

        }
    }
}])