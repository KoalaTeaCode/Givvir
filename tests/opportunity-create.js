var supertest = require('supertest');
var expect = require('expect.js');
var async = require('async.js');

var url = "http://45.55.227.229:3001/api";
var request = supertest(url);

describe('Opportunities', function() {

  describe('Anonymous Users', function() {

    describe('Creating', function() {
      it ('should prevent anonymous users from accessing', function(done){
        request
       	.post('/opportunities')
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


    describe('Creating', function() {
      it ('should allow logged in users', function(done){
         request
        	.post('/opportunities')
          .type('form')
          .set('x-access-token', token)
        	.send()
        	.end(function(err, res) {
            if (err) {
              throw err;
            }
            expect(res.body.data.__v).to.equal(0);
            done();
          });
       });
    });//End of Creating

  });//End of Authenticated
});
