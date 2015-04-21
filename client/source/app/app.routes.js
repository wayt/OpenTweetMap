
    angular.module('opentm').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider.otherwise({
            redirectTo: '/home'
        });
    }]);
