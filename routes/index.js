var express = require('express');
var router = express.Router();
var client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

/* GET home page. */
router.get('/', function(req, res, next) {

	//Send an SMS text message
	client.sendMessage({

	    to:'+16692310573', // Any number Twilio can deliver to
	    from: '+16692310573', // +16692310573 A number you bought from Twilio and can use for outbound communication
	    body: 'This is a test' // body of the SMS message

	}, function(err, responseData) { //this function is executed when a response is received from Twilio

	    if (!err) { // "err" is an error received during the request, if any

	        // "responseData" is a JavaScript object containing data received from Twilio.
	        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
	        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

	        console.log(responseData.from); // outputs "+14506667788"
	        console.log(responseData.body); // outputs "word to your mother."

	    }
	});

	client.IncomingPhoneNumbers.get(function(err, response) {

	        console.log(response);

	});

	client.messages.get(function(err, response) {
	    response.messages.forEach(function(messages) {
	        console.log('Received from: ' + messages.from);
	        console.log('Body: ' + messages.body);
	    });
	});

	res.render('index', {
		title: 'Express',
		token: capability.generate()
	});

});

module.exports = router;
