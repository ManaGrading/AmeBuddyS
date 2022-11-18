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
var clientLookup = {};// clients search engine
var sockets = {};//// to storage sockets
var serverSocket;

var dictClients = {};

var currentLesson;

// function OnSendToAll(msg) {

// 	clients.forEach(function (i) 
// 	{
// 		sockets[i.id].emit('Broadcast', msg);
// 	});
// }

function SendToServer(_Data) {
    serverSocket.emit('NetMsgToServer', _Data);
}

//open a connection with the specific client
io.on('connection', function (socket) {

	//print a log in node.js command prompt
	console.log('A user ready for connection!');

	//to store current client connection
	var currentUser;
//SERVER
    socket.on('899318', function (_data) {
        if(serverSocket != null) {
            console.log("##########Potential hack detected #################");
            serverSocket.emit("HackThreat", "HACK THREAT - A NEW SERVER ATTEMPTED TO REGISTER");
        }
        console.log("Server authenticated");
        serverSocket = socket;	
        serverSocket.emit('OnNetworkInitialized', socket.id);
       
	});
    socket.on('NetMsgFromServer', function (_data) {
		console.log("doing a");
        console.log("looking for: "+  _data.userID);
        dictClients[_data.userID].emit('NetMsgFromServer', _data);
	});

    socket.on('NetStringFromServer', function (_data) {
       
        dictClients[_data.userID].emit('NetStringFromServer', _data);
	});

    if(serverSocket == null) return;
      
    socket.on('OnRequestInterface', function (_data) {
        console.log("User: " + socket.id + " request reg");
        dictClients[socket.id] = socket;
        serverSocket.emit('RegisterClient', socket.id);
	});
    
    socket.on('NetMsgToServer', function (_data) {
        //send this to server.
		_data.userID = socket.id;
		serverSocket.emit('NetMsgToServer', _data);
	});

	socket.on('OnBroadCastToAll', function (_data) {

		socket.broadcast.emit('Broadcast', "ALT BROAD");


		clients.forEach(function (i) {
			//send to the client.js script
			socket.emit('Broadcast', currentUser.name + " " + _data.toString() + " " + clients.length.toString());
		});//end_forEach
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
console.log("-------Fireing up the Mana Core V0.1A -------");