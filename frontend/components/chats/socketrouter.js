
import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:8000');

function subscribeToMessages(cb) {
	socket.on('chat', (message) => {
		cb(message); //passes to client
	});
  }

function sendMessage(message, cb) {
	console.log("Sent message " + message);
	socket.emit('chat', message);
	        console.log("werwer");

	cb(true);
}


export { 
	subscribeToMessages,
	sendMessage
};