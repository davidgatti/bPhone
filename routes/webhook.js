'use strict';

var express = require('express');
var router = express.Router();
var client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

/* GET home page. */
router.post('/', function(req, res, next) {

	let obj = {
		to: req.body.To.slice(1),
		from: req.body.From.slice(1)
	};

	//
	//	Query Twilio to retrieve the content of the received message
	//
	client.messages(req.body.SmsMessageSid).get(function(err, message) {

		//
		//	Send to the front-end the new message
		//
    	process.bphone.emit('message', {
            date: message.dateCreated,
            body: message.body
        });

		//
		//	Highlight the number that sent us the new message.
		//
		process.bphone.emit('newMessage', obj);

	});

    res.status(200);
    res.end('OK');

});

module.exports = router;
