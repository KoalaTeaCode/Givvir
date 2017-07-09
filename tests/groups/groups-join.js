// var request = require('superagent');
var supertest = require('supertest');
var expect = require('expect.js');
var async = require('async.js');

var url = "http://45.55.227.229:3001/api";
var request = supertest(url);

describe('Anonymous Users', function() {

  describe('Joining', function() {
    it ('should prevent anonymous users from accessing', function(done){
      request
     	.post('/groups/join')
     	.send()
     	.end(function(err, res) {
         if (err) {
           throw err;
         }
         expect(res).to.exist;
         expect(res.status).to.equal(403);
         done();
       });
     });
  });

});//End of Anonymous

describe('Authenticated Users', function() {
  var token;

  beforeEach(function(done) {
    var body = {
      username: 'krh121791',
      password: 'A1s2d3F$'
    };
    request
    .post('/signin')
    .type('form')
    .send(body)
    .end(function(err, res) {
       if (err) {
         throw err;
       }
       token = res.body.data.token;
       done();
    });
  });

  describe('joining', function() {

    it ('allows user to join public group', function(done){
      var oppId;
      var oppToJoin;
      var newToken;
      async.waterfall([
          function (callback) {
            request
             .post('/groups')
             .type('form')
             .set('x-access-token', token)
             .send({title: "Public Opp", privacy: "public"})
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               oppToJoin = {
                 id: res.body.data._id
               }
               callback()
             });
          },
          function (callback) {
            var body = {
              username: 'krh121792',
              password: 'A1s2d3F$'
            };
            request
            .post('/signin')
            .type('form')
            .send(body)
            .end(function(err, res) {
               if (err) {
                 throw err;
               }
               newToken = res.body.data.token;
               callback();
            });
          },
          function (callback) {
            var data = {
              id: oppToJoin.id,
            };
            request
             .post('/groups/join')
             .type('form')
             .set('x-access-token', newToken)
             .send(data)
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               callback()
             });
          },
          function (callback) {
            request
             .get('/members?groupOpId=' + oppToJoin.id)
             .set('x-access-token', token)
             .send()
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               expect(res.body[0]).to.have.property('userId')
               callback()
             });
          }
      ], done)
    });

    it ('prevents user from join public group twice', function(done){
      var oppId;
      var oppToJoin;
      var newToken;
      async.waterfall([
          function (callback) {
            request
             .post('/groups')
             .type('form')
             .set('x-access-token', token)
             .send({title: "Public Opp", privacy: "public"})
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               oppToJoin = {
                 id: res.body.data._id
               }
               callback()
             });
          },
          function (callback) {
            var body = {
              username: 'krh121792',
              password: 'A1s2d3F$'
            };
            request
            .post('/signin')
            .type('form')
            .send(body)
            .end(function(err, res) {
               if (err) {
                 throw err;
               }
               newToken = res.body.data.token;
               callback();
            });
          },
          function (callback) {
            var data = {
              id: oppToJoin.id,
            };
            request
             .post('/groups/join')
             .type('form')
             .set('x-access-token', newToken)
             .send(data)
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               callback()
             });
          },
          function (callback) {
            var data = {
              id: oppToJoin.id,
            };
            request
             .post('/groups/join')
             .type('form')
             .set('x-access-token', newToken)
             .send(data)
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               expect(res.body.message).to.equal("Member already exists");
               callback()
             });
          }
      ], done)
    });

    it ('prevents user from joining a private group', function(done){
      var oppId;
      var oppToJoin;
      var newToken;
      async.waterfall([
          function (callback) {
            request
             .post('/groups')
             .type('form')
             .set('x-access-token', token)
             .send({title: "Public Opp", privacy: "private"})
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               oppToJoin = {
                 id: res.body.data._id
               }
               callback()
             });
          },
          function (callback) {
            var body = {
              username: 'krh121792',
              password: 'A1s2d3F$'
            };
            request
            .post('/signin')
            .type('form')
            .send(body)
            .end(function(err, res) {
               if (err) {
                 throw err;
               }
               newToken = res.body.data.token;
               callback();
            });
          },
          function (callback) {
            var data = {
              id: oppToJoin.id,
            };
            request
             .post('/groups/join')
             .type('form')
             .set('x-access-token', newToken)
             .send(data)
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               expect(res.body.message).to.equal("You need an invite to join this group");
               callback()
             });
          },
          function (callback) {
            request
             .get('/members?groupOpId=' + oppToJoin.id)
             .set('x-access-token', token)
             .send()
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               expect(res.body.length).to.equal(0)
               callback()
             });
          }
      ], done)
    });

    it ('allow user to join a private group if they have been invited', function(done){
      var oppId;
      var oppToJoin;
      var newToken;
      var userToInvite;
      async.waterfall([
          function (callback) {
            request
             .post('/groups')
             .type('form')
             .set('x-access-token', token)
             .send({title: "Public Opp", privacy: "private"})
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               oppToJoin = {
                 id: res.body.data._id
               }
               callback()
             });
          },
          function (callback) {
            var body = {
              username: 'krh121791',
              permissions: { inviteGroups: oppToJoin.id }
            };
            request
            .put('/users')
            .type('form')
            .send(body)
            .end(function(err, res) {
               if (err) {
                 throw err;
               }
               callback();
            });
          },
          function (callback) {
            var body = {
              username: 'krh121792',
              password: 'A1s2d3F$'
            };
            request
            .post('/signin')
            .type('form')
            .send(body)
            .end(function(err, res) {
               if (err) {
                 throw err;
               }
               userToInvite = res.body.data;
               newToken = res.body.data.token;
               callback();
            });
          },
          function (callback) {
            var data = {
              id: oppToJoin.id,
              userId: userToInvite._id,
              inviteType: "user",
            };
            request
             .post('/groups/invite')
             .type('form')
             .set('x-access-token', token)
             .send(data)
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               callback()
             });
          },
          function (callback) {
            var data = {
              id: oppToJoin.id,
            };
            request
             .post('/groups/join')
             .type('form')
             .set('x-access-token', newToken)
             .send(data)
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               expect(res.body.message).to.equal("Member Accepted Invite");
               callback()
             });
          },
          function (callback) {
            request
             .get('/members?groupOpId=' + oppToJoin.id)
             .set('x-access-token', token)
             .send()
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               expect(res.body.length).to.equal(1)
               callback()
             });
          }
      ], done)
    });

  });

});//End of Authenticated
