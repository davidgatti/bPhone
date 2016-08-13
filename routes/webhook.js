var express = require('express');
var router = express.Router();
var client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

/* GET home page. */
router.post('/', function(req, res, next) {

    console.log(req.body.SmsMessageSid);


    client.messages(req.body.SmsMessageSid).get(function(err, response) {

            console.log(response);

    });

    res.status(200);
    res.end('OK');

});

module.exports = router;
