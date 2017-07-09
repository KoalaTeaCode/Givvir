phonecatApp.controller('OpportunityDetailCtrl', function ($scope, $routeParams, Opportunities, Members, Chat ) {

  $scope.opportunity = {};
  $scope.members = {};
  $scope.messages = [];


  Opportunities.getOne({id: $routeParams.opportunityId})
    .success(function(data) {
      $scope.opportunity = data[0];
    });

  Members.get({groupOpId: $routeParams.opportunityId})
    .success(function(data) {
      $scope.members = data;
    });

  $scope.joinOpportunity = function() {
    var data = {
      id: $routeParams.opportunityId,
    }
    Opportunities.join(data)
      .success(function(data) {
        $scope.members.push(data.data);
      });
  }

  $scope.leaveOpportunity = function(member) {
    var data = {
      id: $scope.opportunity._id,
    }
    member.status = "left";
    Opportunities.leave(data)
      .success(function(data) {
      });
  }

  $scope.removeMember = function(member) {
    var data = {
      id: member._id,
    }
    member.status = "removed";
    Opportunities.removeMember(data)
      .success(function(data) {
      });
  }

  $scope.markedParticipated = function(member) {
    var data = {
      id: member._id,
      participated: true,
    }
    member.participated = true;
    Members.put(data)
      .success(function(data) {
      });
  }

  Chat.get({toId: $routeParams.opportunityId})
    .success(function(data) {
      console.log(data)
      $scope.messages = data;
    });

  $scope.addMessage = function() {
    var data = {
      message: $scope.messageToAdd.message,
      toId: $routeParams.opportunityId,
      type: "public",
    }
    $scope.messageToAdd.message = "";
    Chat.post(data)
      .success(function(data) {
        $scope.messages.push(data.chat);
      });
  }

  $scope.updateMessage = function(message) {
    var data = {
      message: message.message,
      id: message._id
    }
    Chat.put(data)
      .success(function(data) {
        Chat.get({toId: $routeParams.opportunityId})
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
        Chat.get({toId: $routeParams.opportunityId})
          .success(function(data) {
            console.log(data)
            $scope.messages = data;
          });
      });
  }

});
