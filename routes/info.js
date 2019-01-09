var express = require('express');
var router = express.Router();

/* Require controller modules */
var info_controller = require('../controllers/infoController.js');

/* GET index page. */
router.get('/', info_controller.index);

module.exports = router;
