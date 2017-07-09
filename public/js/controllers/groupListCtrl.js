
phonecatApp.controller('GroupListCtrl', function ($scope, $routeParams, Groups) {

  $scope.groups = {};
  $scope.selectedGroup = {};

  Groups.get()
    .success(function(data) {
      $scope.groups = data;
      console.log(data)
    });

  // Groups.post({name: "test"})
  //   .success(function(data) {
  //     console.log(data)
  //   });
  

});
