var express = require('express');
var router = express.Router();

/* Require controller modules */
var api_controller = require('../controllers/apiController.js');

/* GET Last State from Google IoT Core. */
router.get('/lastState/:deviceId', api_controller.lastState);

/* POST Config to Google IoT Core. */
router.post('/lastState/:deviceId', api_controller.lastState_post);

module.exports = router;
