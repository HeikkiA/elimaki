'use strict';

var Payback = require('../payback/payback.model');
var Purchase = require('../purchase/purchase.model');
var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var Promise = require('node-promise');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', { sort: { name: 'asc'}}, function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.wasNew = true;
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  if ('' + req.user._id === req.params.id) {
    return res.send(403, { message: "Users cannot delete themselves." });
  }
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Updated my user data
 */
exports.update = function(req, res, next) {
  User.findById(req.user._id, function (err, user) {
    if (err) {
      return validationError(res, err);
    }
    if (!user) {
      return res.send(404);
    }
    var updated = _.merge(user, req.body);
    updated.save(function (err) {
      if (err) {
        return validationError(res, err);
      }
      return res.json(200);
    });
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if (user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403, { message: 'Wrong current password.', field: 'password' });
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

/**
 * Get my stats
 */
exports.stats = function(req, res, next) {
  var userId = req.user._id;

  // purchases made
  var purchasesMade = Purchase.aggregate([
    { $match: {
      author: userId
    }},
    { $group: {
      _id: userId,
      total: { $sum: '$amount' },
      count: { $sum: 1 }
    }}
  ]).exec();

  // purchases which include me
  var purchasesIncluded = Purchase.aggregate([
    { $match: {
      participants: userId
    }},

    // mongodb 2.4 (current version in OpenShift) doesn't support $size
    // { $group: {
    //   _id: userId,
    //   total: { $sum: { $divide: ['$amount', { $size: '$participants' }] } },
    //   count: { $sum: 1 }
    // }}

    // mongodb 2.4 solution
    // count participants size
    { $unwind: '$participants' },
    { $group: {
        _id: '$_id',
        amount: { $first: '$amount' },
        count: { $sum: 1 }
    }},
    // count share in purchase
    {  $group: {
        _id: '$_id',
        share: { $sum: { $divide: ['$amount', '$count'] } },
        count: { $sum: 1 }
    }},
    // sum up
    {  $group: {
        _id: null,
        total: { $sum: '$share' },
        count: { $sum: 1 }
    }}

  ]).exec();

  // paybacks received
  var paybacksReceived = Payback.aggregate([
    { $match: {
      recipient: userId
    }},
    { $group: {
      _id: userId,
      total: { $sum: '$amount' },
      count: { $sum: 1 }
    }}
  ]).exec();

  // paybacks sent
  var paybacksSent = Payback.aggregate([
    { $match: {
      author: userId
    }},
    { $group: {
      _id: userId,
      total: { $sum: '$amount' },
      count: { $sum: 1 }
    }}
  ]).exec();

  Promise.all([purchasesMade, purchasesIncluded, paybacksReceived, paybacksSent]).then(function(values) {
    var empty = { count: 0, total: 0 };
    var made = values[0].length && values[0][0] || empty;
    var included = values[1].length && values[1][0] || empty;
    var received = values[2].length && values[2][0] || empty;
    var sent = values[3].length && values[3][0] || empty;
    var data = {
      purchasesMade: made,
      purchasesIncluded: included,
      paybacksReceived: received,
      paybacksSent: sent,
      balance: made.total - included.total + sent.total - received.total
    };
    return res.json(200, data);
  });
};
