var express = require('express');
var router = express.Router();
var twilio = require('twilio');

/* GET home page. */
router.get('/', function(req, res, next) {

	//
	//	require the Twilio module and create a REST client
	//
	var client = new twilio.RestClient(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

	var capability = new twilio.Capability(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

    capability.allowClientOutgoing('PNaf64f3f173183a315a1d9bccdc813b11');
    capability.allowClientIncoming('jenny');

	res.render('index', {
		title: 'Express',
		token: capability.generate()
	});

});

module.exports = router;
