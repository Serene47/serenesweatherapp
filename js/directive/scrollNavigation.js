app.directive("scrollNavigation",["$window","$document",function($window,$document){

    return {
        restrict : 'A',
        link : function($scope,iElement,iAttrs,controller){

            var previousYOffset = $window.pageYOffset;

            var navLinks = iElement.find("nav li a");

            var locationSelectArticle = iElement.find("#locationSelect");

            var  currentWeatherArticle = iElement.find("#currentWeather");

            var  forecastArticle = iElement.find("#forecast");

            var  about = iElement.find("#about");

            var navChangeHeight = 0.33;

            $document.bind("scroll",function(event){

                if($window.pageYOffset > previousYOffset){

                    if($window.pageYOffset + $window.innerHeight > (about.offset().top + navChangeHeight * about.height())){

                        angular.element(navLinks).removeClass("nav-active");

                        angular.element(navLinks[2]).addClass("nav-active");

                    } else if($window.pageYOffset + $window.innerHeight > ((forecastArticle.offset().top + navChangeHeight * forecastArticle.height()))){

                        angular.element(navLinks).removeClass("nav-active");

                        angular.element(navLinks[1]).addClass("nav-active");
                        
                    }

                } else {

                    if($window.pageYOffset  <= (forecastArticle.offset().top - navChangeHeight * (currentWeatherArticle.height() + locationSelectArticle.height())) ){

                        angular.element(navLinks).removeClass("nav-active");

                        angular.element(navLinks[0]).addClass("nav-active");

                    } else if($window.pageYOffset  <= (about.offset().top -  navChangeHeight * forecastArticle.height()) ){

                        angular.element(navLinks).removeClass("nav-active");

                        angular.element(navLinks[1]).addClass("nav-active");
                    }
                }

                previousYOffset = $window.pageYOffset;
            })

            navLinks.bind("click",function(event){

                var target = event.target;

                var article = target.getAttribute("data-article");

                var top = 0;

                if(article == "about"){

                    top = about.offset().top;

                } else if(article == "forecast"){

                    top = forecastArticle.offset().top;

                } else if(article == "currentWeather"){

                   top = 0;

                }

                $window.scrollTo({
                    top : top,
                    left : 0,
                    behavior : "smooth"
                })

            })

        }
    }
}])