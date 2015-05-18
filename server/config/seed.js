/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Category = require('../api/category/category.model');
var Payback = require('../api/payback/payback.model');
var Purchase = require('../api/purchase/purchase.model');
var User = require('../api/user/user.model');

Category.find({}).remove(function() {
  Category.create({
    name: 'Food'
  }, {
    name: 'Fuel'
  }, {
    name: 'Other'
  });
  console.log('Finished populating categories');
});

Payback.find({}).remove(function() {
  console.log('Finished clearing paybacks');
});

Purchase.find({}).remove(function() {
  console.log('Finished clearing purchases');
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test',
    realName: 'Test User',
    email: 'test@test.com',
    iban: 'FI2112345600000785',
    password: 'test'
  }, {
    provider: 'local',
    name: 'Admin',
    role: 'admin',
    realName: 'Administrator',
    email: 'admin@test.com',
    iban: 'FI2112345600000785',
    password: 'test'
  }, function() {
      console.log('Finished populating users');
    }
  );
});
