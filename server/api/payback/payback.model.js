'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PaybackSchema = new Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  description: String,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payback', PaybackSchema);