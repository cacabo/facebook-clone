
import axios from 'axios';
import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:8000');
const uuid = require('uuid-v4');


// Listens to messages
function subscribeToMessages(cb) {
	socket.on('message', (message) => {
		console.log("received message data");
		cb(message);
	});
}

// Listens for invitations
function subscribeToInvitations(username, cb) {
	// User is part of a specialized room for receving invitations
	socket.emit('joinRoom', username + 'inviteRoom');


	console.log("Received Invite");

	socket.on('invite', (data) => {
		cb(data);
	});
}

// Sends a message
function sendMessage(message, cb) {
	const messageData = JSON.parse(message);
	const room = messageData.room;

	console.log("Sent message " + message + " " + room);
	socket.emit('message', message);
	cb(true);
}

// Invites a user to a room
function invite(room, chatTitle, username, inviter, cb) {
	const params = {
		autoJoin: false,
		sender: inviter,
		roomToReceive: username + 'inviteRoom',
		roomToJoin: room,
		chatTitle: chatTitle,
		users: [],
	};

	socket.emit('invite', JSON.stringify(params));
	cb(true);
}

// Joins a room
function joinRoom(room, cb) {
	axios.get('/api/chat/' + room )
	.then(checkData => {
		console.log("Reached joinRoom socketrouter.js");
        // If success is true, user has invited already
        if(checkData.data.success === true) {
        	// console.log("sdfsdffdssdf " + checkData.data.data.numUsers);

        	// if (checkData.data.data.numUsers >= 3) {
        	// 	console.log("Successss");

        	// 	const params = {
        	// 		autoJoin: true,
        	// 		roomToReceive: room,
        	// 		roomToJoin: uuid(),
        	// 		chatTitle: checkData.data.data.chatTitle + " (" + checkData.data.data.numUsers + ")",
        	// 	};

        	// 	console.log("PARAMS ");
        	// 	console.log(params);

        	// 	socket.emit('invite', JSON.stringify(params));

        	// } else {
        		socket.emit('joinRoom', room);
        	// }
        } else {
        	console.log("Failed to get chat");
        }
    })
	.catch(err => {
		console.log(err);
	});
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
