/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Payback = require('./payback.model');

var authorQuery = { path: 'author', select: '_id name' };
var recipientQuery = { path: 'recipient', select: '_id name' };

exports.register = function(socket) {
  Payback.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Payback.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  Payback.findOne({ _id: doc._id }).populate(authorQuery).populate(recipientQuery).exec(function (err, payback) {
    if (!err) {
      socket.emit('payback:save', payback);
      // console.log('socket.emit payback:save', payback);
    }
  });
}

function onRemove(socket, doc, cb) {
  socket.emit('payback:remove', doc);
}