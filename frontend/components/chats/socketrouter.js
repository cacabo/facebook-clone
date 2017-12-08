
import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:8000');

function subscribeToMessages(cb) {
	socket.on('message', (message) => {
		console.log("received message data");
		cb(message); //passes to client
	});
}

function subscribeToinvitations(cb) {
	socket.on('invite', (data) => {
		var info = JSON.parse(data);

		//popup indicator in cb
		cb(true); //passes to client
	});
}

function sendMessage(message, cb) {
	var messageData = JSON.parse(message);
	var room = messageData.room;

	//store message in database mapped to room

	console.log("Sent message " + message + " " + room);
	
	socket.emit('message', message);
	cb(true);
}

//room - the username of the friend you want to invite
function invite(room, username, inviter, cb) {
	var params = {
		sender: inviter,
		roomToReceive: username,
		roomToJoin: room
	};

	socket.emit('invite', JSON.stringify(params));
	cb(true);
}

function joinRoom(room, cb) {
	socket.emit('joinRoom', room);
	cb(true);
}

function leaveRoom(room, cb) {
	socket.emit('leaveRoom', room);
	cb(true);
}


export { 
	subscribeToMessages,
	subscribeToinvitations,
	sendMessage,
	invite,
	joinRoom,
	leaveRoom,
};
