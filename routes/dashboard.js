var express = require('express');
var router = express.Router();

/* Require controller modules */
var index_controller = require('../controllers/dashboardController.js');

/* GET home page. */
router.get('/', index_controller.index);



/* POST home page. */
router.post('/', index_controller.config_form_post);

module.exports = router;
