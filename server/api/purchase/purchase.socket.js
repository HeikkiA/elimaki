/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Purchase = require('./purchase.model');

exports.register = function(socket) {
  Purchase.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Purchase.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  Purchase.findOne({ _id: doc._id }).populate('author').populate('category').populate('participants').exec(function (err, purchase) {
    if (!err) {
      socket.emit('purchase:save', purchase);
      // console.log('socket.emit purchase:save', purchase);
    }
  });
}

function onRemove(socket, doc, cb) {
  socket.emit('purchase:remove', doc);
}