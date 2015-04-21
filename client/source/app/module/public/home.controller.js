angular.module('opentm')
    .controller('HomeController', ['$scope', '$rootScope', 'leafletData', '$timeout', function($scope, $rootScope, leafletData, $timeout) {
        $scope.hashtags = [];
        $scope.tweetList = [];
        var wsList = [];
        var maxTweets = 10;

        var map = L.map('map', {
            center: [25, 0],
            zoom: 2,
            maxZoom: 8
        });
        var googleLayer = new L.Google('ROADMAP');
        map.addLayer(googleLayer);

        console.log('HomeController: twttr: ');
        console.log(twttr);

        $scope.addHashtag = function(hashtag) {
            console.log('addHashtag: hashtag: ' + hashtag);
            $scope.hashtags.push({'name': hashtag});
            hashtagName = hashtag;
            hashtag = new WebSocket('ws://localhost:4242/track/' + hashtag);
            hashtag.onmessage = handleNewTweet;
            wsList.push({'name': hashtagName, 'ws': hashtag});

            console.log('addHashtag: wsList: ');
            console.log(wsList);
        };

        $scope.deleteHashtag = function(hashtag) {
            var hashtagIndex = $scope.hashtags.indexOf(hashtag);
            console.log('deleteHashtag: hashtagIndex: ' + hashtagIndex);
            $scope.hashtags.splice(hashtagIndex, 1);
            var index = 0;
            for (var i = 0 ; i < wsList.length ; i++) {
                if (wsList[i].name == hashtag) {
                    wsList[i].ws.close();
                    index = i;
                }
            }
            wsList.splice(index, 1);
        };

        function handleNewTweet(event) {
            console.log('handleNewTweet: event: ');
            console.log(event.data);

            tweet = JSON.parse(event.data);
            console.log('handleNewTweet: tweet: ');
            console.log(tweet);
            tweet.text = (decodeURIComponent(tweet.text));
            tweet.text = (tweet.text).replace(/[+]/g, " ");
            var obj = {
                lat: tweet.location[0],
                lng: tweet.location[1],
                message: '<b>' + tweet.screen_name + '</b></br>' + tweet.text
            };
            console.log(obj.message);

            L.marker([obj.lat, obj.lng], {
                riseOnHover: true,
                clickable: true
            }).addTo(map).bindPopup(obj.message);

            $timeout(function () {
              twttr.widgets.load();
            }, 30);

            console.log('HomeController: twttr: ');
            console.log(twttr);

            window.twttr.widgets.createTweet(
              tweet.id,
              document.getElementById("container"),
              {
                theme: 'light'
              }
            ).then(function(el) {
              console.log('twitter: tweet created');
          });

        }
}]);
