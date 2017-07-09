var User = require('../models/user');

exports.postUser = function(req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password
  });

  user.save(function(err) {
    if (err)
      res.send(err);

      res.json({message: "New user added"});
  });
};

exports.getUser = function(req, res) {
  User.find(function(err, User) {
    if (err)
      res.send(err);

    res.json(User);
  });
};

exports.deleteUser= function(req, res) {
  User.remove({ _id: req.body.id }, function(err) {
    if (!err) {
      //message.type = 'notification!';
      res.json({ message: 'User Deleted from the locker!'});
    } else {
      //message.type = 'error';
    }
  });
};

exports.putUser = function(req, res) {

  var update = {};

  if (req.body.username) {
    update.username = req.body.username;
  }

  if (req.body.permissions.deletableGroups) {
    update = { $set : { 'permissions.deleteableGroups': [req.body.permissions.deleteableGroups] } };
  }

  if (req.body.permissions.updateableGroups) {
    update = { $set : { 'permissions.updateableGroups': [req.body.permissions.updateableGroups] } };
  }

  if (req.body.permissions.inviteGroups) {
    update = { $set : { 'permissions.inviteGroups': [req.body.permissions.inviteGroups] } };
  }

  if (req.body.permissions.removeGroups) {
    update = { $set : { 'permissions.removeGroups': [req.body.permissions.removeGroups] } };
  }

  //{ _id: req.body.id }
  User.update({ username: req.body.username }, update, function(err, num, raw) {
    if (err)
      res.send(err);

    res.json({ message:' updated', data: num });
  });
};
