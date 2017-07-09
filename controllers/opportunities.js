var Opportunities = require('../models/opportunities');
var Members = require('../models/members');
var async = require('async.js');

exports.postOpportunities = function(req, res) {
  var Opportunity = new Opportunities();
  Opportunity.title = req.body.title;
  Opportunity.userId = req.user._id;

  if (req.body.categories) {
    Opportunity.categories = [req.body.categories]
  }

  if (req.body.groupOpId) {
    Opportunity.groupOpId = req.body.groupOpId
  }

  if (req.body.type) {
    Opportunity.type = req.body.type
  }

  if (req.body.privacy) {
    Opportunity.privacy = req.body.privacy
  }

  Opportunity.save(function(err, opp) {
    if (err)
      res.send(err);

      res.json({message: "New Opportunities added", data: opp});
  });
};

exports.getOpportunities = function(req, res) {
  var query = {};

  if (req.query.id) {
    query._id = req.query.id
  }

  if (req.query.categories) {
    query.categories = { $in: [req.query.categories] }
  }

  if (req.query.groupOpId) {
    query.groupOpId = req.query.groupOpId
  }

  //@TODO: Add members - making sure to include user if member
  //@TODO: Add paging

  Opportunities.find(query, function(err, Opportunities) {
    if (err)
      res.send(err);

    res.json(Opportunities);
  });
};

exports.deleteOpportunities= function(req, res) {

  //Permissions
    //You must have delete permissions for group opportunity is a part of
    //or You must have created the opportunity

  var query = {
     _id: req.body.id,
     $or: [
       {userId: req.user._id } ,
       {groupOpId: { $in: req.user.permissions.deleteableGroups }},
     ],
  };

  Opportunities.remove(query, function(err, opp) {
    if (!err) {
      //message.type = 'notification!';
      res.json({ message: 'Opportunities Deleted to the locker!'});
    } else {
      //message.type = 'error';
    }
  });
};

exports.putOpportunities = function(req, res) {

  var groupPermissionId = [-1];

  if (req.user.permissions.updateableGroups) {
    groupPermissionId = req.user.permissions.updateableGroups;
  }

  var query = {
    _id: req.body.id,
    $or: [
      {userId: req.user._id } ,
      {groupOpId: { $in: groupPermissionId }},
    ],
  };

  var update = {};

  if (req.body.title) {
    update.title = req.body.title
  }

  if (req.body.categories) {
    update.$set = { categories: [req.body.categories] }
  }

  Opportunities.update(query, update, function(err, num, raw) {
    if (!err) {
      //message.type = 'notification!';
      res.json({ message: num + ' updated' });
    } else {
      //message.type = 'error';
      res.send(err);
    }
  });
};

exports.inviteToOpportunites = function(req, res) {

  if (!req.body.inviteType) return res.json({message: "Must have invite type"});

  //Find existing user or by email or by text?
  var inviteType = req.body.inviteType;
  if (inviteType === "user") {
    var opp;
    async.waterfall([
        function (callback) {
          Opportunities.findOne({ _id: req.body.id }, function(err, Opportunities) {
            if (!err) {
              opp = Opportunities;
              callback(null, Opportunities);
            } else {
              res.send(err);
            }
          });
        },
        function (opp, callback) {
          //Check if there is a duplicate or invite
          Members.findOne({groupOpId: opp._id, userId: req.body.userId }, function(err, member) {
            if (!err) {
              callback(null, member);
            } else {
              res.send(err);
            }
          });

        },
        function (member, callback) {
          //Permissions
            //Anyone can join open group
            //If invite only or private, check to see if user has an invite
          if (opp.privacy === "public") {
            if (member) {
              res.json({message: "Invite already exists", data: member});
            } else {
              var member = new Members();
              member.userId = req.body.userId
              member.groupOpId = opp._id;
              member.type = "opportunity";
              member.inviteAccepted = 0;
              member.save(function(err, member) {
                if (err)
                  res.send(err);

                  res.json({message: "New invite added", data: member});
              });
            }
          } else if (opp.privacy === "private") {
            //Check for invite permission
            if ( req.user.permissions.inviteGroups.indexOf(opp._id) !== -1 ) {
              var member = new Members();
              member.userId = req.body.userId
              member.groupOpId = opp._id;
              member.type = "opportunity";
              member.inviteAccepted = 0;
              member.save(function(err, member) {
                if (err)
                  res.send(err);

                  res.json({message: "New invite added", data: member});
              });
            } else {
              res.json({message: "You must have permission to invite to this group"});
            }
          }

        }
    ], null)
  }

}

exports.joinOpportunites = function(req, res) {
  var opp;
  async.waterfall([
      function (callback) {
        Opportunities.findOne({ _id: req.body.id }, function(err, Opportunities) {
          if (!err) {
            opp = Opportunities;
            callback(null, Opportunities);
          } else {
            res.send(err);
          }
        });
      },
      function (opp, callback) {
        //Check if there is a duplicate or invite
        Members.findOne({groupOpId: opp._id, userId: req.user._id }, function(err, member) {
          if (!err) {
            callback(null, member);
          } else {
            res.send(err);
          }
        });
      },
      function (member, callback) {
        //Permissions
          //Anyone can join open group
          //If invite only or private, check to see if user has an invite
        if (opp.privacy === "public") {
          if (member) {
            if (member.inviteAccepted === false) {
              member.inviteAccepted = true;
              member.signedUp = true;
              member.save(function(err, member) {
                if (err)
                  res.send(err);

                  res.json({message: "Member Accepted Invite", data: member});
              });
            } else {
              res.json({message: "Member already exists", data: member});
            }
          } else {
            var member = new Members();
            member.userId = req.user._id;
            member.groupOpId = opp._id;
            member.signedUp = true;
            member.type = "opportunity";
            member.save(function(err, member) {
              if (err)
                res.send(err);

                res.json({message: "New member added", data: member});
            });
          }
        } else if (opp.privacy === "private") {
          if (!member) {
            res.json({message: "You need an invite to join this group"});
          } else if (member.inviteAccepted === false) {
            member.inviteAccepted = true;
            member.signedUp = true;
            member.save(function(err, member) {
              if (err)
                res.send(err);

                res.json({message: "Member Accepted Invite", data: member});
            });
          } else {
            res.json({message: "Error"});
          }
        } else {
          res.json({message: "Error"});
        }

      }
  ], null)
}

exports.leaveOpportunities = function(req, res) {

  var update = {
    left: true
  };
  console.log(req.body)
  Members.update({ userId: req.user._id, groupOpId: req.body.groupOpId }, update, function(err, member) {
    if (!err) {
      if (member.nModified === 0) {
        res.json({message: "You are not a member"});
      } else {
        res.json({message: "You left the opp"});
      }
    } else {
      res.send(err);
    }
  });
}

exports.removeMemberFromOpportunites = function(req, res) {

  if ( !req.user.permissions.removeGroups || req.user.permissions.removeGroups.indexOf(req.body.groupOpId) === -1 ) {
    res.json({message: "You do not have access to remove the opp"});
  } else {
    var query = {
      userId: req.body.userId,
      groupOpId: req.body.groupOpId
    };

    var update = {
      removed: true
    };

    Members.update(query, update, function(err, member) {
      if (!err) {
        if (member.nModified === 0) {
          res.json({message: "This member does not exist"});
        } else {
          res.json({message: "You removed a member from the opp"});
        }
      } else {
        res.send(err);
      }
    });
  }

}
