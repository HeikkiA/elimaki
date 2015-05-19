'use strict';

var _ = require('lodash');
var Payback = require('./payback.model');

var authorQuery = { path: 'author', select: '_id name' };
var recipientQuery = { path: 'recipient', select: '_id name' };

// Get list of paybacks
exports.index = function(req, res) {
  Payback.find().populate(authorQuery).populate(recipientQuery).exec(function (err, paybacks) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, paybacks);
  });
};

// Get a single payback
exports.show = function(req, res) {
  Payback.findById(req.params.id, function (err, payback) {
    if (err) {
      return handleError(res, err);
    }
    if (!payback) {
      return res.send(404);
    }
    return res.json(payback);
  });
};

// Creates a new payback in the DB.
exports.create = function(req, res) {
  Payback.create(req.body, function(err, payback) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, payback);
  });
};

// Updates an existing payback in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Payback.findById(req.params.id, function (err, payback) {
    if (err) {
      return handleError(res, err);
    }
    if (!payback) {
      return res.send(404);
    }
    var updated = _.merge(payback, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, payback);
    });
  });
};

// Deletes a payback from the DB.
exports.destroy = function(req, res) {
  Payback.findById(req.params.id, function (err, payback) {
    if (err) {
      return handleError(res, err);
    }
    if (!payback) {
      return res.send(404);
    }
    payback.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

/*
 * Get paybacks sent by me
 */
exports.sent = function(req, res, next) {
  var userId = req.params.userId;
  Payback.find({ author: userId }).populate(recipientQuery).exec(function(err, paybacks) {
    if (err) {
      return handleError(res, err);
    }
    res.json(200, paybacks);
  });
}

/*
 * Get paybacks received by me
 */
exports.received = function(req, res, next) {
  var userId = req.params.userId;
  Payback.find({ recipient: userId }).populate(authorQuery).populate(recipientQuery).exec(function(err, paybacks) {
    if (err) {
      return handleError(res, err);
    }
    res.json(200, paybacks);
  });
}

function handleError(res, err) {
  return res.send(500, err);
}