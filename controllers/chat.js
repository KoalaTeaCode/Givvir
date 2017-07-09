var Chat = require('../models/chat');

exports.postChat = function(req, res) {
  var chat = new Chat();
  chat.message = req.body.message;
  //chat.userId = req.body.userId;
  chat.toId = req.body.toId;
  chat.type = req.body.type;

  chat.save(function(err, chat) {
    if (!err) {
      //message.type = 'notification!';
      res.json({message: "New Chat added", chat: chat});
    } else {
      //message.type = 'error';
      res.send(err);
    }
  });
};

exports.getChat = function(req, res) {
  var query = {
    type: "public",
    toId: req.query.toId,
  }
  console.log(query)
  Chat.find(query, function(err, Chat) {
    if (err)
      res.send(err);

    res.json(Chat);
  });
};

exports.deleteChat= function(req, res) {
  Chat.remove({ _id: req.body.id }, function(err) {
    if (!err) {
      //message.type = 'notification!';
      res.json({ message: 'Chat Deleted to the locker!'});
    } else {
      //message.type = 'error';
    }
  });
};

exports.putChat = function(req, res) {
  //@TODO: Check permissions
  var update = {};

  if (req.body.message) {
     update.message = req.body.message;
  }

  Chat.update({ _id: req.body.id }, update, function(err, num, raw) {
    if (err)
      res.send(err);

    res.json({ message: num + ' updated' });
  });
};
