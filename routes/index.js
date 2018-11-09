var express = require('express');
var router = express.Router();

/* Require controller modules */
var index_controller = require('../controllers/indexController.js');

/* GET home page. */
router.get('/', index_controller.index);

module.exports = router;
