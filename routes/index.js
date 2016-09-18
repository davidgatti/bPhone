'use strict';

let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {

	//
	//	Render the page
	//
	res.render('index');

});

module.exports = router;
