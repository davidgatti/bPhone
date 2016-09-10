'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/*', function(req, res, next) {

	//
	//	Attach the Web Socket to the NodeJS server
	//
	let io = process.bphone;

	let obj = {
		from: req.query.To.slice(1),
		to: req.query.From.slice(1)
	};

	io.emit('alert', 'New Message to: ' + req.query.To);
	io.emit('newMessage', obj);

    res.status(200);
    res.end('OK');

});

module.exports = router;
