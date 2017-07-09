var phonecatApp = angular.module('phonecatApp');

phonecatApp.factory('Opportunities', function($http){
  return {
    get: function(data) {
      return $http({
        method: 'GET',
        url: '/api/opportunities',
      });
    },
    getOne: function(data) {
      return $http({
        method: 'GET',
        url: '/api/opportunities?id=' + data.id,
      });
    },
    getGroupOpportunities: function(data) {
      return $http({
        method: 'GET',
        url: '/api/opportunities?groupOpId=' + data.groupOpId,
      });
    },
    post: function(data) {
      return $http({
          method: 'POST',
          url: '/api/opportunities',
          data: "title=" + data.title + '&groupOpId=' + data.groupOpId + "&type=" + data.type,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    },
    join: function(data) {
      return $http({
          method: 'POST',
          url: '/api/opportunities/join',
          data: "id=" + data.id,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    },
    leave: function(data) {
      return $http({
          method: 'POST',
          url: '/api/opportunities/leave',
          data: "groupOpId=" + data.id,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    },
    removeMember: function(data) {
      return $http({
          method: 'POST',
          url: '/api/opportunities/remove-member',
          data: "id=" + data.id,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    },
    delete: function(data) {
      return $http({
          method: 'DELETE',
          url: '/api/opportunities',
          data: "id=" + data._id,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }
  }
});
