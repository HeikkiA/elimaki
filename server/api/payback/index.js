'use strict';

var express = require('express');
var controller = require('./payback.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/sent/:userId', auth.isAuthenticated(), controller.sent);
router.get('/received/:userId', auth.isAuthenticated(), controller.received);

module.exports = router;