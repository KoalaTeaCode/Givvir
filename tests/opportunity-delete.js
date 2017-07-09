// var request = require('superagent');
var supertest = require('supertest');
var expect = require('expect.js');
var async = require('async.js');

var url = "http://45.55.227.229:3001/api";
var request = supertest(url);

describe('Opportunities', function() {

  describe('Anonymous Users', function() {

    describe('Deleting', function() {
      it ('should prevent anonymous users from accessing', function(done){
        request
       	.delete('/opportunities')
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

    describe('delete', function() {
      it ('prevent user from deleting if not created or no permission', function(done){
        var oppId;
        var oppToDelete;
        var newToken;
        async.waterfall([
            function (callback) {
              request
               .post('/opportunities')
               .type('form')
               .set('x-access-token', token)
               .send()
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
              request
               .delete('/opportunities')
               .type('form')
               .set('x-access-token', newToken)
               .send(oppToDelete)
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
               .send(oppToDelete)
               .end(function(err, res) {
                 if (err) {
                   throw err;
                 }
                 expect(res.body.length).to.equal(1);
                 callback()
               });
            }
        ], done)
      });

      it ('should allow users to delete if created', function(done){
        var oppId;
        var oppToDelete;
        async.waterfall([
            function (callback) {
              request
               .post('/opportunities')
               .type('form')
               .set('x-access-token', token)
               .send()
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
              request
               .delete('/opportunities')
               .type('form')
               .set('x-access-token', token)
               .send(oppToDelete)
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
               //.type('form')
               .set('x-access-token', token)
               .send(oppToDelete)
               .end(function(err, res) {
                 if (err) {
                   throw err;
                 }
                 expect(res.body.length).to.equal(0);
                 callback()
               });
            }
        ], done)
      });

      it ('should allow users to delete if they have permission', function(done){
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
                permissions: { deletableGroups: 1 }
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
              request
               .delete('/opportunities')
               .type('form')
               .set('x-access-token', newToken)
               .send(oppToDelete)
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
               //.type('form')
               .set('x-access-token', token)
               .send(oppToDelete)
               .end(function(err, res) {
                 if (err) {
                   throw err;
                 }
                 expect(res.body.length).to.equal(0);
                 callback()
               });
            }
        ], done)
      });

    });

  });//End of Authenticated
});
