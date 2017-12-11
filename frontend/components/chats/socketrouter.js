
import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:8000');


// Listens to messages
function subscribeToMessages(cb) {
	socket.on('message', (message) => {
		console.log("received message data");
		cb(message);
	});
}

// Listens for invitations
function subscribeToInvitations(cb) {
	socket.on('invite', (data) => {
		//popup indicator in cb
		cb(data);
	});
}

// Sends a message
function sendMessage(message, cb) {
	const messageData = JSON.parse(message);
	const room = messageData.room;

	//store message in database mapped to room

	console.log("Sent message " + message + " " + room);
	
	socket.emit('message', message);
	cb(true);
}

// Invites a user to a room
function invite(room, username, inviter, cb) {
	const params = {
		sender: inviter,
		roomToReceive: username + 'inviteRoom', //this is the temporary room where we can invite someone
		roomToJoin: room,
		users: [],
	};

	socket.emit('invite', JSON.stringify(params));
	cb(true);
}

// Joins a room
function joinRoom(room, users cb) {
	if (users.length == 2) {
		//TODO: create new room and invite users to join. Must also join yourself
		// Special invites where they automatically join
	} else {
		socket.emit('joinRoom', room);
	}
	cb(true);
}

// Leaves a room
function leaveRoom(room, cb) {
	socket.emit('leaveRoom', room);
	cb(true);
}


export { 
	subscribeToMessages,
	subscribeToInvitations,
	sendMessage,
	invite,
	joinRoom,
	leaveRoom,
};
