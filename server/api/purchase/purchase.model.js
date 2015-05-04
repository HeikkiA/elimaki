'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PurchaseSchema = new Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Purchase', PurchaseSchema);