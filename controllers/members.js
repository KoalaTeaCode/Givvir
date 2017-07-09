var Members = require('../models/members');

exports.postMembers = function(req, res) {
  var member = new Members();
  member.userId = req.body.userId;

  if (req.body.groupOpId) {
    member.groupOpId = req.body.groupOpId
  }
  if (req.body.type) {
    member.type = req.body.type
  }

  member.save(function(err) {
    if (err)
      res.send(err);

      res.json({message: "New Members added"});
  });
};

exports.getMembers = function(req, res) {

  var query = {
    left: { $ne: 1 },
    removed: { $ne: 1 },
  };

  if (req.query.id) {
    query._id = req.query.id
  }

  if (req.query.groupOpId) {
    query.groupOpId = req.query.groupOpId
  }

  Members.find(query, function(err, Members) {
    if (err)
      res.send(err);

    res.json(Members);
  });
};

exports.deleteMembers= function(req, res) {
  Members.remove({ _id: req.body.id }, function(err) {
    if (!err) {
      //message.type = 'notification!';
      res.json({ message: 'Members Deleted to the locker!'});
    } else {
      //message.type = 'error';
    }
  });
};

exports.putMembers = function(req, res) {

  var update = {};

  if (req.body.groupOpId) {
    update.groupOpId = req.body.groupOpId
  }

  if (req.body.type) {
    update.type = req.body.type
  }

  if (req.body.participated) {
    update.participated = req.body.participated
  }

  Members.update({ _id: req.body.id }, update, function(err, num, raw) {
    if (!err) {
      //message.type = 'notification!';
      res.json({ message: num + ' updated' });
    } else {
      //message.type = 'error';
      res.send(err);
    }
  });
};
