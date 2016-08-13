var express = require('express');
var router = express.Router();
var twilio = require('twilio');

/* GET home page. */
router.get('/', function(req, res, next) {

	var authToken = 'da329b87d4d9890c92632902ea510531';

    if (twilio.validateExpressRequest(req, authToken)) {
        var resp = new twilio.TwimlResponse();
        resp.say('express sez - hello twilio!');

        res.type('text/xml');
        res.send(resp.toString());
    }
    else {
        res.send('you are not twilio.  Buzz off.');
    }

});

module.exports = router;
