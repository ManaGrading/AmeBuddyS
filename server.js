/*
*@autor: Rio 3D Studios
*@description:  java script server that works as master server of the Basic Example of WebGL Multiplayer Kit
*/
var express = require('express');//import express NodeJS framework module
var app = express();// create an object of the express module
var http = require('http').Server(app);// create a http web server using the http library
var io = require('socket.io')(http);// import socketio communication module


app.use("/public/TemplateData", express.static(__dirname + "/public/TemplateData"));
app.use("/public/Build", express.static(__dirname + "/public/Build"));
app.use(express.static(__dirname + '/public'));

var clients = [];// to storage clients
var words = [];
var screenWords = [];
var clientLookup = {};// clients search engine
var sockets = {};//// to storage sockets
var subjects = [];

var currentLesson;

// function OnSendToAll(msg) {

// 	clients.forEach(function (i) 
// 	{
// 		sockets[i.id].emit('Broadcast', msg);
// 	});
// }

//open a connection with the specific client
io.on('connection', function (socket) {

	//print a log in node.js command prompt
	console.log('A user ready for connection!');

	//to store current client connection
	var currentUser;

	socket.on('OnBroadCastToAll', function (_data) {

		socket.broadcast.emit('Broadcast', "ALT BROAD");


		clients.forEach(function (i) {
			//send to the client.js script
			socket.emit('Broadcast', currentUser.name + " " + _data.toString() + " " + clients.length.toString());
		});//end_forEach
	});

	socket.on('OnUpdateMousePos', function (_data) 
	{
		socket.broadcast.emit('OnSetPlayerMousePos', _data, currentUser.id);
	});//END_SOCKET_ON

	socket.on('OnBroadCastJsonToAll', function (_data) 
	{
		
		socket.broadcast.emit('OnSendJsonGlobal', _data);

	});//END_SOCKET_ON

	socket.on('OnAddNewWord', function (_data) 
	{
		socket.emit('OnGetAllWords', _data);		
		socket.emit('OnGetAllScreenWords', _data);
		socket.broadcast.emit('OnGetAllWords', _data);
		socket.broadcast.emit('OnGetAllScreenWords', _data);
		words.push(_data);
		screenWords.push(_data);
		
	});//END_SOCKET_ON

	socket.on('OnBroadCastJsonToAllAndMe', function (_data) 
	{
		words.push(_data);
        
		socket.emit("OnSendJsonGlobal", _data);
		socket.broadcast.emit('OnSendJsonGlobal', _data);

	});//END_SOCKET_ON

	socket.on('OnGetAllWords', function (_data) 
	{
		
		for(let i = 0; i < words.length; i++) 
		{
			socket.emit("OnGetAllWords", words[i]);
		}
	});

	socket.on('OnGetAllScreenWords', function (_data) 
	{
		for(let i = 0; i < screenWords.length; i++) 
		{
			socket.emit("OnGetAllScreenWords", words[i]);
		}
	});

	socket.on('OnClearScreenWords', function (_data) 
	{
		screenWords = [];
		socket.emit("OnClearScreenWords2", "-");
	});


	socket.on('OnAddNewSubject', function (_data) 
	{
		console.log("Added subject: " + _data);
		subjects.push(_data);
		socket.emit("OnAddNewSubject",_data);
	});

	socket.on('OnGetAllSubjects', function (_data) 
	{
		for(let i = 0; i < subjects.length; i++) 
		{
			socket.emit("OnAddNewSubject", subjects[i]);
		}
	});

	socket.on('OnStartRoulette', function (_data) 
	{
		var subject = subjects[Math.floor(Math.random() * (subjects.length - 1))];
		
		subjects.splice(subjects.indexOf(_data), 1);

		console.log("There is: " + subjects.length + " subects left");
		socket.emit("OnClearSubject", subject);
		socket.broadcast.emit("OnClearSubject", subject);
	});

	socket.on('OnRegisterClient', function (_data) {

		console.log(_data);
		currentUser = {
			id:socket.id,//alternatively we could use socket.id
			name: _data.toString(),
			socketID: socket.id,//fills out with the id of the socket that was open
		};//new user  in clients list
		socket.emit("test", currentUser);
		sockets[currentUser.id] = socket;
		clients.push(currentUser);
		clientLookup[currentUser.id] = currentUser;
		//send to the client.js script
		socket.emit("OnClientRegistered", "Registered");

		//socket.broadcast.emit('Broadcast', "ALT BROAD");
		socket.broadcast.emit('OnNewClientJoined', _data, currentUser.id);

		//let me know the others.
		clients.forEach(function (i) {
			if (i.id != currentUser.id) {
				//send to the client.js script
				socket.emit('OnNewClientJoined', i.name, i.id);

			}//END_IF

		});//end_forEach

	// 	if(currentUser) {
		// clients.forEach(function (i) {
		// 	//send to the client.js script
		// 	socket.emit('Broadcast', "User " + currentUser.name + " has joined.");
		// });//end_forEach
	// }
		//OnSendToAll("User has joined.");
	});//END_SOCKET_ON

	//create a callback fuction to listening EmitJoin() method in NetworkMannager.cs unity script
	socket.on('JOIN', function (_data) {

		console.log('[INFO] JOIN received !!! ');

		var data = JSON.parse(_data);

		// fills out with the information emitted by the player in the unity
		currentUser = {
			id: socket.id,//alternatively we could use socket.id
			name: data.name,
			avatar: data.avatar,
			position: data.position,
			rotation: '0',
			socketID: socket.id,//fills out with the id of the socket that was open
			isMute: false
		};//new user  in clients list

		console.log('[INFO] player ' + currentUser.name + ': logged!');


		sockets[currentUser.id] = socket;//add curent user socket


		//add currentUser in clients list
		clients.push(currentUser);

		//add client in search engine
		clientLookup[currentUser.id] = currentUser;


		console.log('[INFO] Total players: ' + clients.length);

		/*********************************************************************************************/

		//send to the client.js script
		socket.emit("JOIN_SUCCESS", currentUser.id, currentUser.name, currentUser.position, currentUser.avatar);

		//spawn all connected clients for currentUser client 
		clients.forEach(function (i) {
			if (i.id != currentUser.id) {
				//send to the client.js script
				socket.emit('SPAWN_PLAYER', i.id, i.name, i.position, i.avatar);

			}//END_IF

		});//end_forEach

		// spawn currentUser client on clients in broadcast
		socket.broadcast.emit('SPAWN_PLAYER', currentUser.id, currentUser.name, currentUser.position, currentUser.avatar);


	});//END_SOCKET_ON






	//create a callback fuction to listening EmitMoveAndRotate() method in NetworkMannager.cs unity script
	socket.on('MESSAGE', function (_data) {


		var data = JSON.parse(_data);


		if (currentUser) {

			// send current user position and  rotation in broadcast to all clients in game
			socket.emit('UPDATE_MESSAGE', data.chat_box_id, currentUser.id, data.message);

			sockets[data.guest_id].emit('UPDATE_MESSAGE', data.chat_box_id, currentUser.id, data.message);

		}
	});//END_SOCKET_ON


	//create a callback fuction to listening EmitMoveAndRotate() method in NetworkMannager.cs unity script
	socket.on('SEND_OPEN_CHAT_BOX', function (_data) {


		var data = JSON.parse(_data);


		if (currentUser) {

			// send current user position and  rotation in broadcast to all clients in game
			socket.emit('RECEIVE_OPEN_CHAT_BOX', currentUser.id, data.player_id);

			//spawn all connected clients for currentUser client 
			clients.forEach(function (i) {
				if (i.id == data.player_id) {
					console.log("send to : " + i.name);
					//send to the client.js script
					sockets[i.id].emit('RECEIVE_OPEN_CHAT_BOX', currentUser.id, i.id);

				}//END_IF

			});//end_forEach


		}
	});//END_SOCKET_ON



	//create a callback fuction to listening EmitMoveAndRotate() method in NetworkMannager.cs unity script
	socket.on('MOVE_AND_ROTATE', function (_data) {
		var data = JSON.parse(_data);

		if (currentUser) {

			currentUser.position = data.position;

			currentUser.rotation = data.rotation;

			// send current user position and  rotation in broadcast to all clients in game
			socket.broadcast.emit('UPDATE_MOVE_AND_ROTATE', currentUser.id, currentUser.position, currentUser.rotation);


		}
	});//END_SOCKET_ON

	socket.on("VOICE", function (data) {


		if (currentUser) {


			var newData = data.split(";");
			newData[0] = "data:audio/ogg;";
			newData = newData[0] + newData[1];


			clients.forEach(function (u) {

				if (sockets[u.id] && u.id != currentUser.id && !u.isMute) {

					sockets[u.id].emit('UPDATE_VOICE', newData);
				}
			});



		}

	});

	socket.on("AUDIO_MUTE", function (data) {


		if (currentUser) {
			currentUser.isMute = !currentUser.isMute;

		}

	});




	// called when the user desconnect
	socket.on('disconnect', function () {

		if (currentUser) {
			currentUser.isDead = true;

			//send to the client.js script
			//updates the currentUser disconnection for all players in game
			socket.broadcast.emit('USER_DISCONNECTED', currentUser.id);


			for (var i = 0; i < clients.length; i++) {
				if (clients[i].name == currentUser.name && clients[i].id == currentUser.id) {

					console.log("User " + clients[i].name + " has disconnected");
					clients.splice(i, 1);

				};
			};

		}

	});//END_SOCKET_ON

});//END_IO.ON


http.listen(process.env.PORT || 3000, function () {
	console.log('listening on *:3000');
});
console.log("------- server is running -------");