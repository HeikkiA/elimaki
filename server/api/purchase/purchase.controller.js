'use strict';

var _ = require('lodash');
var Purchase = require('./purchase.model');

var authorQuery = { path: 'author', select: '_id name' };
var participantQuery = { path: 'participants', select: '_id name' };

// Get list of purchases
exports.index = function(req, res) {
  Purchase.find().populate(authorQuery).populate('category').populate(participantQuery).exec(function (err, purchases) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, purchases);
  });
};

// Get a single purchase
exports.show = function(req, res) {
  Purchase.findById(req.params.id, function (err, purchase) {
    if (err) {
      return handleError(res, err);
    }
    if (!purchase) {
      return res.send(404);
    }
    return res.json(purchase);
  });
};

// Creates a new purchase in the DB.
exports.create = function(req, res) {
  Purchase.create(req.body, function(err, purchase) {
        if (err) {
      return handleError(res, err);
    }
    return res.json(201, purchase);
  });
};

// Updates an existing purchase in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Purchase.findById(req.params.id, function (err, purchase) {
    if (err) {
      return handleError(res, err);
    }
    if (!purchase) {
      return res.send(404);
    }
    var updated = _.merge(purchase, req.body);
    updated.save(function (err) {
          if (err) {
      return handleError(res, err);
    }
      return res.json(200, purchase);
    });
  });
};

// Deletes a purchase from the DB.
exports.destroy = function(req, res) {
  Purchase.findById(req.params.id, function (err, purchase) {
    if (err) {
      return handleError(res, err);
    }
    if (!purchase) {
      return res.send(404);
    }
    purchase.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

/*
 * Get my purchases
 */
exports.made = function(req, res, next) {
  var userId = req.params.userId;
  Purchase.find({ author: userId }).populate('category').populate(participantQuery).exec(function(err, purchases) {
    if (err) {
      return handleError(res, err);
    }
    res.json(200, purchases);
  });
}

/*
 * Get purchases that include me
 */
exports.included = function(req, res, next) {
  var userId = req.params.userId;
  Purchase.find({ participants: userId }).populate(authorQuery).populate('category').populate(participantQuery).exec(function(err, purchases) {
    if (err) {
      return handleError(res, err);
    }
    res.json(200, purchases);
  });
}

function handleError(res, err) {
  return res.send(500, err);
}