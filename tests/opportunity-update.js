// var request = require('superagent');
var supertest = require('supertest');
var expect = require('expect.js');
var async = require('async.js');

var url = "http://45.55.227.229:3001/api";
var request = supertest(url);

//describe('Anonymous Users', function() {

//   describe('Creating', function() {
//     it ('should prevent anonymous users from accessing', function(done){
//       request
//      	.post('/opportunities')
//      	.send()
//      	.end(function(err, res) {
//          if (err) {
//            throw err;
//          }
//          expect(res).to.exist;
//          expect(res.status).to.equal(403);
//          done();
//        });
//      });
//   });
//
// });//End of Anonymous

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

  describe('update', function() {
    it ('prevent user from updating if not created or no permission', function(done){
      var oppId;
      var oppToDelete;
      var newToken;
      async.waterfall([
          function (callback) {
            request
             .post('/opportunities')
             .type('form')
             .set('x-access-token', token)
             .send({title: "Old Title"})
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               oppToDelete = {
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
              id: oppToDelete.id,
              title: "new Title",
            };
            request
             .put('/opportunities')
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
             .get('/opportunities?id=' + oppToDelete.id)
             .send()
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               expect(res.body[0].title).to.equal("Old Title");
               callback()
             });
          }
      ], done)
    });

    it ('should allow users to update if created', function(done){
      var oppId;
      var oppToDelete;
      async.waterfall([
          function (callback) {
            request
             .post('/opportunities')
             .type('form')
             .set('x-access-token', token)
             .send({title: "Old Title"})
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               oppToDelete = {
                 id: res.body.data._id
               }
               callback()
             });
          },
          function (callback) {
            var data = {
              id: oppToDelete.id,
              title: "new Title",
            };
            request
             .put('/opportunities')
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
            request
             .get('/opportunities?id=' + oppToDelete.id)
             .set('x-access-token', token)
             .send()
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               expect(res.body[0].title).to.equal("new Title");
               callback()
             });
          }
      ], done)
    });

    it ('should allow users to update if they have permission', function(done){
      var oppId;
      var oppToDelete;
      var newToken;
      async.waterfall([
          function (callback) {
            var data = {
              groupOpId: 1
            }
            request
             .post('/opportunities')
             .type('form')
             .set('x-access-token', token)
             .send(data)
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               oppToDelete = {
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
            var body = {
              username: 'krh121792',
              permissions: { updateableGroups: 1 }
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
              id: oppToDelete.id,
              title: "new Title",
            };
            request
             .put('/opportunities')
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
             .get('/opportunities?id=' + oppToDelete.id)
             .set('x-access-token', token)
             .send(oppToDelete)
             .end(function(err, res) {
               if (err) {
                 throw err;
               }
               expect(res.body[0].title).to.equal("new Title");
               callback()
             });
          }
      ], done)
    });

  });
});//End of Authenticated
