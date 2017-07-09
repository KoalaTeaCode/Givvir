
phonecatApp.controller('OpportunityListCtrl', function ($scope, $routeParams, Opportunities, Members) {

  //Default Values
  $scope.members = {};

  $scope.dateIndex = 0;

  $scope.nextDate = function() {
    $scope.dateIndex += 1;
    setDate();
  }

  $scope.prevDate = function() {
    $scope.dateIndex -= 1;
    setDate();
  }

  $scope.articleFilters = {}

  function setDate() {
    var startDate = new Date();
    startDate.setDate(startDate.getDate()+$scope.dateIndex);
    var startDateInfo = [startDate.getDate(), startDate.getMonth()+1, startDate.getFullYear()];
    $scope.articleFilters.date1 = startDateInfo.join("-");

    var endDate = new Date();
    endDate.setDate(endDate.getDate()+$scope.dateIndex);
    var endDateInfo = [endDate.getDate()+1, endDate.getMonth()+1, endDate.getFullYear()];
    $scope.articleFilters.date2 = endDateInfo.join("-");
  }
  setDate();

  // $scope.articleFilters.genre = "";
  // if ($routeParams.genre) {
  //   $scope.articleFilters.genre = $routeParams.genre;
  //   $scope.articleFilters.filterTerm = "genre";
  // }

  Opportunities.get()
    .success(function(data) {
      $scope.phones = data;
      console.log(data)
    });

  //@TODO: Use directive
  // $scope.selectedArticle = {}
  // $scope.readMore = function(article) {
  //   var modal = document.querySelector("#articleModal");
  //   $scope.selectedArticle = article;
  //   $("#articleModal").modal('show');
  //   Members.get(article)
  //     .success(function(data) {
  //       $scope.members = data;
  //       console.log(data)
  //     });
  // }

  $scope.join = function(article) {
    Opportunities.join(article)
      .success(function(data) {
          console.log(data);
      });
  }

});
