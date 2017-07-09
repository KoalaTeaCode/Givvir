var phonecatApp = angular.module('phonecatApp');

phonecatApp.factory('Chat', function($http){
  return {
    get: function(data) {
      return $http({
        method: 'GET',
        url: '/api/chat?toId='+data.toId,
      });
    },
    post: function(data) {
      return $http({
          method: 'POST',
          url: '/api/chat',
          data: "toId=" + data.toId + "&message=" + data.message +  "&type=" + data.type,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    },
    put: function(data) {
      return $http({
          method: 'PUT',
          url: '/api/chat',
          data: "id=" + data.id + "&message=" + data.message,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    },
    delete: function(data) {
      return $http({
          method: 'DELETE',
          url: '/api/chat',
          data: "id=" + data.id,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }
  }
});
