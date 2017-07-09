var phonecatApp = angular.module('phonecatApp', [
  'ngRoute',
  'ngCookies',
  'ngStorage'
]);

phonecatApp.config(['$routeProvider', '$httpProvider', '$locationProvider', function ($routeProvider, $httpProvider, $locationProvider) {
    $routeProvider.
      when('/opportunities', {
        templateUrl: 'partials/opportunity-list.html',
        controller: 'OpportunityListCtrl'
      }).
      when('/opportunities/:opportunityId', {
        templateUrl: 'partials/opportunity-detail.html',
        controller: 'OpportunityDetailCtrl'
      }).
      when('/organizations', {
        templateUrl: 'partials/groups-list.html',
        controller: 'GroupListCtrl'
      }).
      when('/organizations/:groupId', {
        templateUrl: 'partials/group-detail.html',
        controller: 'GroupDetailCtrl'
      }).
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'HomeCtrl'
      }).
      when('/signup', {
        templateUrl: 'partials/signup.html',
        controller: 'HomeCtrl'
      }).
      otherwise({
        redirectTo: '/opportunities'
      });

      // use the HTML5 History API
      //$locationProvider.html5Mode(true);

      $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
          return {
              'request': function (config) {
                  config.headers = config.headers || {};
                  if ($localStorage.token) {
                      //config.headers.Authorization = 'Bearer ' + $localStorage.token;
                      config.headers['x-access-token'] = $localStorage.token;
                  }
                  return config;
              },
              'responseError': function(response) {
                  if(response.status === 401 || response.status === 403) {
                      $location.path('/signin');
                  }
                  return $q.reject(response);
              }
          };
      }]);

  }]);
