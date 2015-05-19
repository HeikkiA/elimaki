/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Purchase = require('./purchase.model');

var authorQuery = { path: 'author', select: '_id name' };
var participantQuery = { path: 'participants', select: '_id name' };

exports.register = function(socket) {
  Purchase.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Purchase.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  Purchase.findOne({ _id: doc._id }).populate(authorQuery).populate('category').populate(participantQuery).exec(function (err, purchase) {
    if (!err) {
      socket.emit('purchase:save', purchase);
      // console.log('socket.emit purchase:save', purchase);
    }
  });
}

function onRemove(socket, doc, cb) {
  socket.emit('purchase:remove', doc);
}