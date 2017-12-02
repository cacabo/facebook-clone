const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const api = require('./backend/routes');

const socket = require('socket.io')();
socket.listen(8000);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);

app.get('*', (request, response) => {
    response.sendFile(__dirname + '/public/index.html'); // For React/Redux
});

app.listen(PORT, error => {
    error
    ? console.error(error)
    : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});

// The event will be called when a client is connected. Right when the app opens
socket.on('connection', (socket) => {
	console.log('A client just joined on', socket.id);

	//pull from database all chats pertaining to user and connect to them
    socket.join('1');
    socket.join('12');
    socket.join('4');

    //maybe have info of which room message came from in message json
    //emit only to that room once query room out of JSON object
	socket.on('message', (message) => {
		var messageData = JSON.parse(message);
		var room = messageData.room;

		console.log("Broadcast reached " + message.body + " " + room);
		socket.broadcast.to(room).emit('message', message);
	});
});