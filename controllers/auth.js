var User = require('../models/user');
var jwt        = require("jsonwebtoken");

exports.authenticate = function(req, res) {
    User.findOne({username: req.body.username}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
          user.verifyPassword(req.body.password, function(err, isMatch){
            if (isMatch) {
               res.json({
                    type: true,
                    data: user,
                    token: user.token
                });
            } else {
                res.json({
                    type: false,
                    data: "Incorrect email/password"
                });
            }
          });

        }
    });
};

exports.signup = function(req, res) {
  User.findOne({username: req.body.username, password: req.body.password}, function(err, user) {
      if (err) {
          res.json({
              type: false,
              data: "Error occured: " + err
          });
      } else {
          if (user) {
              res.json({
                  type: false,
                  data: "User already exists!"
              });
          } else {
              var userModel = new User();
              userModel.username = req.body.username;
              userModel.password = req.body.password;
              userModel.save(function(err, user) {
                 if (!err) {
                    user.token = jwt.sign(user, process.env.JWT_SECRET);
                    user.save(function(err, user1) {
                        res.json({
                            type: true,
                            data: user1,
                            token: user1.token
                        });
                    });
                 } else {
                   res.json({message: err});
                 }
              })
          }
      }
  });
}

exports.ensureAuthorized = function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        User.findOne({token: token}, function(err, user) {
             if (err) {
                 res.json({
                     type: false,
                     data: "Error occured: " + err
                 });
             } else {
               user.password = "";
               req.user = user;
               next();
             }
         });
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
};

exports.me = function(req, res) {

  res.json({
      type: true,
      data: req.user
  });
  // User.findOne({token: req.token}, function(err, user) {
  //      if (err) {
  //          res.json({
  //              type: false,
  //              data: "Error occured: " + err
  //          });
  //      } else {
  //          res.json({
  //              type: true,
  //              data: user
  //          });
  //      }
  //  });
}
