'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

	//
	//	Render the page
	//
	res.render('index', {
		title: 'bPhone'
	});

});

module.exports = router;
