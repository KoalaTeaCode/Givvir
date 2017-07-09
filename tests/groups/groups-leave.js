// var request = require('superagent');
var supertest = require('supertest');
var expect = require('expect.js');
var async = require('async.js');

var url = "http://45.55.227.229:3001/api";
var request = supertest(url);

describe('Anonymous Users', function() {

  describe('leaving', function() {
    it ('should prevent anonymous users from accessing', function(done){
      request
     	.post('/groups/leave')
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

  describe('Leaving', function() {

    it ('allows user to invite to a public group', function(done){
      var oppToLeave;
      var userToLeave;
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
               oppToLeave = {
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
               userToLeave = res.body.data;
               callback();
            });
          },
          function (callback) {
            var data = {
              id: oppToLeave.id,
              userId: userToLeave._id,
              inviteType: 'user',
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
               expect(res.body.message).to.equal('New invite added')
               expect(res.body.data.userId).to.equal(userToLeave._id)
               callback()
             });
          },
          function (callback) {
            var data = {
              id: oppToLeave.id,
            };
            request
             .post('/groups/join')
             .type('form')
             .set('x-access-token', userToLeave.token)
             .send(data)
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               expect(res.body.message).to.equal('Member Accepted Invite')
               expect(res.body.data.userId).to.equal(userToLeave._id)
               callback()
             });
          },
          function (callback) {
            var data = {
              groupOpId: oppToLeave.id,
            };
            request
             .post('/groups/leave')
             .type('form')
             .set('x-access-token', userToLeave.token)
             .send(data)
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               expect(res.body.message).to.equal('You left the group')
               callback()
             });
          },
          function (callback) {
            request
             .get('/members?groupOpId=' + oppToLeave.id)
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

    it ('prevents user from leaving when not a member', function(done){
      var oppToLeave;
      var userToLeave;
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
               oppToLeave = {
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
               userToLeave = res.body.data;
               callback();
            });
          },
          function (callback) {
            var data = {
              groupOpId: oppToLeave.id,
            };
            request
             .post('/groups/leave')
             .type('form')
             .set('x-access-token', userToLeave.token)
             .send(data)
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               expect(res.body.message).to.equal('You are not a member')
               callback()
             });
          },
      ], done)
    });

  });

});//End of Authenticated
