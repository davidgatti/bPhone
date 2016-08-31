'use strict';

var express = require('express');
var router = express.Router();
var client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

router.get('/', function(req, res, next) {

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
						//	Value used to store if a unique number is being found
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

				io.emit('number', number.phoneNumber);

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

			//
			//	List all the messages for a given number
			//
			client.messages.get({From: msg.to, To: msg.from}, function(err, response) {

			    response.messages.forEach(function(messages) {

			        io.emit('message', messages.body);

			    });

			});

			client.messages.get({From: msg.from, To: msg.to}, function(err, response) {

			    response.messages.forEach(function(messages) {

			        io.emit('message', messages.body);

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
		//	Buy new numbers
		//
		socket.on('buy', function(){

			io.emit('bought', "+31231231232");

		});

	});

	//
	//	Render the page
	//
	res.render('index', {
		title: 'Express'
	});

});

module.exports = router;
