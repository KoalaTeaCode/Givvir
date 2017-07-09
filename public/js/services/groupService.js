var phonecatApp = angular.module('phonecatApp');

phonecatApp.factory('Groups', function($http){
  return {
    get: function() {
      return $http({
        method: 'GET',
        url: '/api/groups',
      });
    },
    getOne: function(data) {
      return $http({
        method: 'GET',
        url: '/api/groups?id='+data.id,
      });
    },
    post: function(data) {
      return $http({
          method: 'POST',
          url: '/api/groups',
          data: "name=" + data.name,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    },
    join: function(data) {
      return $http({
          method: 'POST',
          url: '/api/groups/join',
          data: "id=" + data._id,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    },
    leave: function(data) {
      return $http({
          method: 'POST',
          url: '/api/groups/leave',
          data: "id=" + data.id,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    },
    removeMember: function(data) {
      return $http({
          method: 'POST',
          url: '/api/groups/remove-member',
          data: "id=" + data.id,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    },
    delete: function(data) {
      return $http({
          method: 'DELETE',
          url: '/api/groups',
          data: "id=" + data._id,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }
  }
});
