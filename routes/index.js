var express = require('express');
var router = express.Router();
var twilio = require('twilio');

/* GET home page. */
router.get('/', function(req, res, next) {

	//
	//	Twilio Credentials
	//
	var accountSid = 'ACea9543c790190e3bf70267f5bc55b350';
	var authToken = 'da329b87d4d9890c92632902ea510531';

	//
	//	require the Twilio module and create a REST client
	//
	var client = new twilio.RestClient(accountSid, authToken);

	var capability = new twilio.Capability(accountSid, authToken);

    capability.allowClientOutgoing('PNaf64f3f173183a315a1d9bccdc813b11');
    capability.allowClientIncoming('jenny');

	res.render('index', {
		title: 'Express',
		token: capability.generate()
	});

});

module.exports = router;
