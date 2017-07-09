'use strict';

phonecatApp
    .factory('Main', ['$http', '$localStorage', function($http, $localStorage){
        var baseUrl = "api";
        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }

        function getUserFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }

        var currentUser = getUserFromToken();

        return {
            save: function(data, success, error) {
            //   return $http({
            //       method: 'POST',
            //       url: '/api/signup',
            //       data: data,
            //       headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            //     });
            // },
                $http.post(baseUrl + '/signup', data).success(success).error(error)
            },
            signin: function(data, success, error) {
                // $http.post(baseUrl + '/signin', data).success(success).error(error)/
                $http({
                    method: 'POST',
                    url: '/api/signin',
                    data: "username=" + data.username + '&password=' + data.password,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                  }).then(function successCallback(response) {
                    success(response)
                  }, function errorCallback(response) {
                    error(response)
                  });
            },

            me: function(success, error) {
                //$http.get(baseUrl + '/me').success(success).error(error)
                $http({
                    method: 'GET',
                    url: '/api/me',
                  }).then(function successCallback(response) {
                    success(response)
                  }, function errorCallback(response) {
                    error(response)
                  });
            },

            logout: function(success) {
                changeUser({});
                delete $localStorage.token;
                success();
            }
        };
    }
]);
