app.directive("customSelect",["$document",function($document){

    return {
        restrict : 'E',
        template : '<div class="custom-select" ng-click="toggleDropdown()" >' + 
                        '<span class="select-text">{{viewValue}}</span>' + 
                        '<span ng-show="!showOptions" class="select-icon"></span>' + 
                        '<ul class="select-options" ng-show="showOptions && data.length > 0" >' +
                            '<li ng-repeat="obj in data" value="{{obj.value}}" ng-click="selectOption(obj)">{{obj.name}}</li>' + 
                        '</ul>' + 
                    '</div>',
        scope   :   {
            data : '=',
            ngModel : '=',
            placeholder : '@'

        },
        link : function(scope,element,attrs) {

            function hideOnClickOutside(event){

                var target = event.target;

                if(target != element && element.has(target).length == 0){

                    scope.$apply(function(){
                        scope.showOptions = false;
                    })

                    $document.unbind("click",hideOnClickOutside);

                }

            }


            element.find(".custom-select").bind("click",function(event){

                if(scope.showOptions){
                    $document.bind("click",hideOnClickOutside)
                } else {
                    $document.unbind("click",hideOnClickOutside)
                }

            })


        },
        controller : ["$scope","$element","$attrs",function($scope,$element,$attrs){

            $scope.showOptions = false;

            $scope.toggleDropdown = function(){

                $scope.showOptions = !$scope.showOptions;

            }

            $scope.selectOption = function(obj){

                $scope.ngModel = obj.value;

                $scope.viewValue =obj.name;

            }


            $scope.$watch("ngModel",function(newValue,oldValue){

                if(!newValue){

                    $scope.viewValue = $scope.placeholder;
    
                } else {
    
                    $scope.viewValue = $scope.data.filter(function(obj){
                        return obj.value == newValue;
                    })[0].name;
                }

            })


        }]
        
    }

}]);