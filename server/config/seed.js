/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

// var Payback = require('../api/payback/payback.model');
// var Purchase = require('../api/purchase/purchase.model');
// var User = require('../api/user/user.model');

// Payback.find({}).remove();

// Purchase.find({}).remove();

// User.find({}).remove(function() {
//   User.create({
//     provider: 'local',
//     name: 'Tester',
//     realName: 'Test User',
//     email: 'test@test.com',
//     iban: 'FI2112345600000785',
//     password: 'test'
//   }, {
//     provider: 'local',
//     name: 'Admin #1',
//     role: 'admin',
//     realName: 'Admin User',
//     email: 'admin@admin.com',
//     iban: 'FI2112345600000785',
//     password: 'admin'
//   }, function() {
//       console.log('finished populating users');
//     }
//   );
// });
