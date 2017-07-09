var Groups = require('../models/groups');
var Members = require('../models/members');
var async = require('async.js');

exports.postGroups = function(req, res) {
  var group = new Groups({
    title: req.body.title,
    userId: req.user._id,
  });

  if (req.body.privacy) {
    group.privacy = req.body.privacy
  }

  group.save(function(err, group) {
    if (err)
      res.send(err);

    res.json({message: "New Groups added", data: group});
  });
};

exports.getGroups = function(req, res) {
  var query = {};

  if (req.query.id) {
    query._id = req.query.id;
  }

  Groups.find(query, function(err, Groups) {
    if (err)
      res.send(err);

    res.json(Groups);
  });
};

exports.deleteGroups= function(req, res) {
  var query = {
     _id: req.body.id,
     $or: [
       {userId: req.user._id } ,
       {_id: { $in: req.user.permissions.deleteableGroups } },
     ],
  };
  console.log(query.$or, req.user.permissions.deleteableGroups)
  Groups.remove(query, function(err, msg) {
    if (!err) {
      if (msg.result.n === 0) {
        res.json({ message: 'Group not found.'});
      } else {
        res.json({ message: 'Group deleted to the locker!'});
      }
    } else {

    }
  });
};

exports.putGroups = function(req, res) {
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

  Groups.update(query, update, function(err, num, raw) {
    if (!err) {
      //message.type = 'notification!';
      res.json({ message: 'updated', data: num });
    } else {
      //message.type = 'error';
      res.send(err);
    }
  });
};

exports.joinGroups = function(req, res) {
  var opp;
  async.waterfall([
      function (callback) {
        Groups.findOne({ _id: req.body.id }, function(err, Groups) {
          if (!err) {
            opp = Groups;
            callback(null, Groups);
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
        }

      }
  ], null)
}

exports.inviteToGroups = function(req, res) {
  if (!req.body.inviteType) return res.json({message: "Must have invite type"});

  //Find existing user or by email or by text?
  var inviteType = req.body.inviteType;
  if (inviteType === "user") {
    var opp;
    async.waterfall([
        function (callback) {
          Groups.findOne({ _id: req.body.id }, function(err, Groups) {
            if (!err) {
              opp = Groups;
              callback(null, Groups);
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
              member.type = "group";
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
              member.type = "group";
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

exports.leaveGroups = function(req, res) {
  var update = {
    left: true
  };

  Members.update({ userId: req.user._id, groupOpId: req.body.groupOpId }, update, function(err, member) {
    if (!err) {
      if (member.nModified === 0) {
        res.json({message: "You are not a member"});
      } else {
        res.json({message: "You left the group"});
      }
    } else {
      res.send(err);
    }
  });
}

exports.removeMemberFromGroups = function(req, res) {

  if ( !req.user.permissions.removeGroups || req.user.permissions.removeGroups.indexOf(req.body.groupOpId) === -1 ) {
    res.json({message: "You do not have access to remove the group"});
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
          res.json({message: "You removed a member from the group"});
        }
      } else {
        res.send(err);
      }
    });
  }

}
