
import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:8000');

function subscribeToMessages(cb) {
	socket.on('message', (message) => {
		cb(message); //passes to client
	});
}

function sendMessage(room, message, cb) {
	var messageData = JSON.parse(message);
	var room = messageData.room;

	console.log("Sent message " + message + " " + room);
	
	socket.emit('message', message);
	cb(true);
}



export { 
	subscribeToMessages,
	sendMessage,
};