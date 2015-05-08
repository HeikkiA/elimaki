'use strict';

var express = require('express');
var controller = require('./purchase.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/made/:userId', auth.isAuthenticated(), controller.made);
router.get('/included/:userId', auth.isAuthenticated(), controller.included);

module.exports = router;