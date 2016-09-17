'use strict';

let express = require('express');
let router = express.Router();
let client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

router.post('/', function(req, res, next) {

	//
	//	Saving necessary data from the Twilio post
	//
	let obj = {
		to: req.body.To,
		from: req.body.From
	};

	//
	//	Query Twilio to retrieve the content of the received message
	//
	client.messages(req.body.SmsMessageSid).get(function(err, message) {

		//
		//	Send to the front-end the new message
		//
    	process.bphone.emit('message', {
    		origin: "webhook",
            date: message.dateCreated,
            body: message.body
        });

		//
		//	Highlight the number that sent us the new message.
		//
		process.bphone.emit('newMessage', obj);

	});

	//
	//	Let Twilio know that we got the message.
	//
    res.status(200);
    res.end('OK');

});

module.exports = router;
