angular.module('opentm', [
    'ngRoute',
    'ngMaterial',
    'templates.app',
    'templates.common',
    'leaflet-directive',
    'ngWebsocket'
])

.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange');
});

angular.module('opentm').controller('AppController', ['$scope', function($scope) {
//    console.log('AppController: twttr: ');
//    console.log(twttr);
}]);

angular.module('opentm').controller('HeaderController', ['$scope', '$rootScope', '$location',
    function($scope, $rootScope, $location) {
        $scope.home = function() {
            $location.path('/home');
        };

        $scope.isNavbarActive = function(navBarPath) {
            return (navBarPath === $location.path());
        };

        $scope.menuLinks = [{
            url: '/home',
            title: 'Accueil'
        }, {
            url: '/about',
            title: 'A propos'
        }];
}]);
