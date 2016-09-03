'use strict';

var express = require('express');
var router = express.Router();
var client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

router.get('/', function(req, res, next) {

	//
	//	Check if the account is active or not
	//
	client.accounts(process.env.ACCOUNT_SID).get(function(err, account) {
		
		if(err)
		{
			io.emit('alert', err.message);
		}
		else
		{
			if(account.status != 'active')
			{
				io.emit('alert', account.status);
			}
		}
	
	});

	//
	//	Attach the Web Socket to the NodeJS server
	//
	let io = require('socket.io').listen(req.socket.server);

	//
	//	Listen for connections
	//
	io.on('connection', function(socket) {

		//
		//	Settings
		//
		socket.setMaxListeners(20);

		//
		//	List all the numbers
		//
		client.incomingPhoneNumbers.list(function(err, data) {

			if(err)
			{
				return 1;
			}

			data.incomingPhoneNumbers.forEach(function(number) {

				client.messages.get({To: number.phoneNumber}, function(err, response) {

					response.messages.reduce(function(array, element) {

						//
						//	Add at least one element
						//
						if(array.length == 0)
						{
							array.push(element.from);
						}

						//
						//	Value used to store if a unique number is being 
						//	found
						//
						let count = 0;

						//
						//	Look for unique numbers
						//
						for(let key in array)
						{
							//
							//	If number different then increment, if the same
							//	decrement
							//
							if(array[key] != element.from)
							{
								count++;
							}
							else
							{
								count--;
							}
						}

						//
						//	If the reminder is one, we know we have to add the
						//	number to the array
						//
						if(count == 1)
						{
							array.push(element.from);
						}

						//
						//	Return the array fro the next loop
						//
						return array;

					}, [])
					.forEach(function(ble) {

						let obj = {
							from: ble,
							to: number.phoneNumber
						}

						io.emit('fromNumber', obj);

					});

				});

				let obj = {
					sid: number.sid,
					nr: number.phoneNumber
				}

				io.emit('number', obj);

			});

		});

		//
		//	Do something in disconnect.
		//
		socket.on('disconnect', function(){

			console.log('user disconnected');

		});

		//
		// List all the messages for a given number
		//
		socket.on('messages', function(msg) {

			client.messages.get({From: msg.from, To: msg.to}, function(err, response) {

				response.messages.forEach(function(messages) {

					io.emit('message', {
						date: messages.dateCreated,
						body: messages.body
					});

				});

			});

			//
			//	List all the messages for a given number
			//
			client.messages.get({From: msg.to, To: msg.from}, function(err, response) {

				response.messages.forEach(function(messages) {

					io.emit('message', {
						date: messages.dateCreated,
						body: messages.body
					});

				});

			});

		});

		//
		//	Send a message for a given number
		//
		socket.on('sendMessage', function(msg) {

			client.sendMessage({

				to: msg.to,
				from: msg.from,
				body: msg.message

			}, function(err, data) {

				if (!err) {

					io.emit('message', data.body);

				}
			});

		});

		//
		//	Send a message for a given number
		//
		socket.on('delete', function(sid, callback) {

			client.incomingPhoneNumbers(sid).delete(function(err, deleted) {

				if (err)
				{
					console.log(err);
				}
				else
				{
					callback();
				}

			});

		});

		//
		//	Buy new numbers
		//
		socket.on('buy', function(country) {

			// 
			//	First, search for available phone numbers
			// 
			client.availablePhoneNumbers(country).local.get().then(function(searchResults) {

				// 
				//	handle the case where there are no numbers found
				// 
				if (searchResults.availablePhoneNumbers.length < 1) 
				{
					io.emit('alert', 'No numbers found with that area code');
				}

				// 
				// 	Okay, so there are some available numbers.  Now, let's buy 
				// 	the first one in the list.  Return the promise created by 
				// 	the next call to Twilio:
				//
				return client.incomingPhoneNumbers.create({

					phoneNumber: searchResults.availablePhoneNumbers[0].phoneNumber,
					voiceUrl:'https://demo.twilio.com/welcome/voice',
					smsUrl:'https://demo.twilio.com/welcome/sms/reply'

				});

			}).then(function(number) {

				let obj = {
					sid: number.sid,
					nr: number.phoneNumber
				};

				// 
				//	We bought the number!  Everything worked!
				// 
				io.emit('bought', obj);

			}).fail(function(error) {

				io.emit('alert', 'Number purchase failed! Reason: ' + error.message);

			});

		});

	});

	//
	//	Render the page
	//
	res.render('index', {
		title: 'bPhone'
	});

});

module.exports = router;
