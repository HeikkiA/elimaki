'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/users', function() {

  it('should respond with empty object', function(done) {
    request(app)
      .get('/api/users')
      .expect(401)
      .expect('Content-Type', /html/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);
        done();
      });
  });
});