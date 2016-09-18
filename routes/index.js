'use strict';

let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {

	console.log(req)

	//
	//	Render the page
	//
	res.render('index');

});

module.exports = router;
