var phonecatApp = angular.module('phonecatApp');

phonecatApp.factory('Members', function($http){
  return {
    get: function(data) {
      return $http({
        method: 'GET',
        url: '/api/members?groupOpId='+data.groupOpId,
      });
    },
    post: function(data) {
      return $http({
          method: 'POST',
          url: '/api/members',
          data: "articleId=" + data._id,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    },
    put: function(data) {
      return $http({
          method: 'PUT',
          url: '/api/members',
          data: "id=" + data.id + "&participated=" + data.participated,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    },
    joinGroup: function(data) {
      return $http({
          method: 'POST',
          url: '/api/groups/join',
          data: "id=" + data.id,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    },
    joinOpportunity: function(data) {
      return $http({
          method: 'POST',
          url: '/api/opportunities/join',
          data: "id=" + data.id,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    },
    leaveOpportunity: function(data) {
      return $http({
          method: 'POST',
          url: '/api/opportunities/leave',
          data: "id=" + data.id,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    },
    delete: function(data) {
      return $http({
          method: 'DELETE',
          url: '/api/members',
          data: "id=" + data._id,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }
  }
});
