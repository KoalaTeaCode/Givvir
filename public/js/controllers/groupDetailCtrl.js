phonecatApp.controller('GroupDetailCtrl', function ($scope, $routeParams, Groups, Members, Chat, Opportunities, Main) {

  $scope.group = {};
  $scope.members = {};
  $scope.messages = [];
  $scope.opportunities = [];

  Main.me(function(data) {
    $scope.user = data.data.data;
  });

  Groups.getOne({id: $routeParams.groupId})
    .success(function(data) {
      $scope.group = data[0];
    });

  Members.get({groupOpId: $routeParams.groupId})
    .success(function(data) {
      $scope.members = data;
    });

  $scope.joinGroup = function() {
    var data = {
      id: $routeParams.groupId,
    }
    $scope.members.push(data);
    Members.joinGroup(data)
      .success(function(data) {
        console.log(data)
        Members.get({groupOpId: $routeParams.groupId})
          .success(function(data) {
            console.log(data)
            $scope.members = data;
          });
      });
  }

  $scope.leaveGroup = function(member) {
    var data = {
      id: member._id,
    }
    Groups.leave(data)
      .success(function(data) {
        console.log(data)
        Members.get({groupOpId: $routeParams.groupId})
          .success(function(data) {
            console.log(data)
            $scope.members = data;
          });
      });
  }

  $scope.removeMember = function(member) {
    var data = {
      id: member._id,
    }
    Groups.removeMember(data)
      .success(function(data) {
        console.log(data)
        Members.get({groupOpId: $routeParams.groupId})
          .success(function(data) {
            console.log(data)
            $scope.members = data;
          });
      });
  }

  Chat.get({toId: $routeParams.groupId})
    .success(function(data) {
      console.log(data)
      $scope.messages = data;
    });

  $scope.addMessage = function() {
    var data = {
      message: $scope.messageToAdd.message,
      toId: $routeParams.groupId,
      type: "public",
    }
    $scope.messages.push(data);
    $scope.messageToAdd.message = "";
    Chat.post(data)
      .success(function(data) {
        console.log(data)
        Chat.get({toId: $routeParams.groupId})
          .success(function(data) {
            console.log(data)
            $scope.messages = data;
          });
      });
  }

  $scope.updateMessage = function(message) {
    var data = {
      message: message.message,
      id: message._id
    }
    Chat.put(data)
      .success(function(data) {
        console.log(data)
        Chat.get({toId: $routeParams.groupId})
          .success(function(data) {
            console.log(data)
            $scope.messages = data;
          });
      });
  }

  $scope.deleteMessage = function(message) {
    var data = {
      id: message._id
    }
    Chat.delete(data)
      .success(function(data) {
        console.log(data)
        Chat.get({toId: $routeParams.groupId})
          .success(function(data) {
            console.log(data)
            $scope.messages = data;
          });
      });
  }

  Opportunities.getGroupOpportunities({groupOpId: $routeParams.groupId})
    .success(function(data) {
      console.log(data)
      $scope.opportunities = data;
    });

  $scope.addOpportunity = function() {
    var data = {
      title: $scope.opportunityToAdd.title,
      groupOpId: $routeParams.groupId,
      type: "public",
    }
    //$scope.opportunities.push(data);
    $scope.opportunities.title = "";
    Opportunities.post(data)
      .success(function(data) {
        $scope.opportunities.push(data.data)
      });
  }

  $scope.deleteOpportunity = function(opportunity) {
    var data = {
      id: opportunity._id,
    }

    Opportunities.delete(data)
      .success(function(data) {
        console.log(data)
        Opportunities.getGroupOpportunities({groupOpId: $routeParams.groupId})
          .success(function(data) {
            console.log(data)
            $scope.opportunities = data;
          });
      });
  }
});
