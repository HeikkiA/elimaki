/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Payback = require('./payback.model');

exports.register = function(socket) {
  Payback.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Payback.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  Payback.findOne({ _id: doc._id }).populate('author').populate('recipient').exec(function (err, payback) {
    if (!err) {
      socket.emit('payback:save', payback);
      // console.log('socket.emit payback:save', payback);
    }
  });
}

function onRemove(socket, doc, cb) {
  socket.emit('payback:remove', doc);
}