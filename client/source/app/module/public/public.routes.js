
    angular.module('opentm').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

        $routeProvider
            .when('/home', {
                templateUrl: 'module/public/home.tpl.html',
                controller: 'HomeController'
            })
            .when('/about', {
                templateUrl: 'module/public/about.tpl.html'
            });
    }]);
