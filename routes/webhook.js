var express = require('express');
var router = express.Router();
var client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

/* GET home page. */
router.post('/', function(req, res, next) {


//ToCountry=PL&ToState=&SmsMessageSid=SM611ee99843c7c1706e8e5a0366599e96&NumMedia=0&ToCity=&FromZip=&SmsSid=SM611ee99843c7c1706e8e5a0366599e96&FromState=CA&SmsStatus=received&FromCity=&Body=Gatti&FromCountry=US&To=%2B48732230012&ToZip=&NumSegments=1&MessageSid=SM611ee99843c7c1706e8e5a0366599e96&AccountSid=ACea9543c790190e3bf70267f5bc55b350&From=%2B16692310573&ApiVersion=2010-04-01
    client.messages(req.body.SmsMessageSid).get(function(err, response) {

            console.log(response.to);
            console.log(response.from);
            console.log(response.body);

    });

    res.status(200);
    res.end('OK');

});

module.exports = router;
