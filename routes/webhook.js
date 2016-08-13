var express = require('express');
var router = express.Router();
var twilio = require('twilio');

/* GET home page. */
router.post('/', function(req, res, next) {

    console.log(req.body);

});

module.exports = router;
