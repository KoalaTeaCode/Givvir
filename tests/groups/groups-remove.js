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
     	.post('/groups/remove-member')
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

    it ('allows user to remove when they have permission', function(done){
      var oppToRemove;
      var userToRemove;
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
               oppToRemove = {
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
               userToRemove = res.body.data;
               callback();
            });
          },
          function (callback) {
            var data = {
              id: oppToRemove.id,
            };
            request
             .post('/groups/join')
             .type('form')
             .set('x-access-token', userToRemove.token)
             .send(data)
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               expect(res.body.message).to.equal('New member added')
               expect(res.body.data.userId).to.equal(userToRemove._id)
               callback()
             });
          },
          function (callback) {
            var body = {
              username: 'krh121791',
              permissions: { removeGroups: oppToRemove.id }
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
            var data = {
              groupOpId: oppToRemove.id,
              userId: userToRemove._id,
            };
            request
             .post('/groups/remove-member')
             .type('form')
             .set('x-access-token', token)
             .send(data)
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               expect(res.body.message).to.equal('You removed a member from the group')
               callback()
             });
          },
      ], done)
    });

    it ('prevents user from removing when not there is no member', function(done){
      var oppToRemove;
      var userToRemove;
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
               oppToRemove = {
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
               userToRemove = res.body.data;
               callback();
            });
          },
          function (callback) {
            var body = {
              username: 'krh121791',
              permissions: { removeGroups: oppToRemove.id }
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
            var data = {
              groupOpId: oppToRemove.id,
              userId: userToRemove._id,
            };
            request
             .post('/groups/remove-member')
             .type('form')
             .set('x-access-token', token)
             .send(data)
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               expect(res.body.message).to.equal('This member does not exist')
               callback()
             });
          },
      ], done)
    });

    it ('prevents user from removing when they dont have access', function(done){
      var oppToRemove;
      var userToRemove;
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
               oppToRemove = {
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
               userToRemove = res.body.data;
               callback();
            });
          },
          function (callback) {
            var data = {
              id: oppToRemove.id,
            };
            request
             .post('/groups/join')
             .type('form')
             .set('x-access-token', userToRemove.token)
             .send(data)
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               expect(res.body.message).to.equal('New member added')
               expect(res.body.data.userId).to.equal(userToRemove._id)
               callback()
             });
          },
          function (callback) {
            var data = {
              groupOpId: oppToRemove.id,
              userId: userToRemove._id,
            };
            request
             .post('/groups/remove-member')
             .type('form')
             .set('x-access-token', token)
             .send(data)
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               expect(res.body.message).to.equal('You do not have access to remove the group')
               callback()
             });
          },
      ], done)
    });

  });

});//End of Authenticated
