var express = require('express');
var router = express.Router();

/* Require controller modules */
var dashboard_controller = require('../controllers/dashboardController.js');

/* Here we are on /dashboard sub-url */

/* GET home page of dashboard. */
router.get('/', dashboard_controller.index);

/* POST home page. */
router.post('/', dashboard_controller.config_form_post);

module.exports = router;
