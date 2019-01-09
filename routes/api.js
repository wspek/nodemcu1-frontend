var express = require('express');
var router = express.Router();

/* Require controller modules */
var api_controller = require('../controllers/apiController.js');

/* GET home page. */
router.get('/lastState/:deviceId', api_controller.lastState);


module.exports = router;
