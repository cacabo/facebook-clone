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

// The event will be called when a client is connected.
socket.on('connection', (socket) => {
	console.log('A client just joined on', socket.id);

	socket.on('chat', (message) => {
		console.log("Broadcast reached");
	  	// The `broadcast` allows us to send to all users but the sender.
	  	socket.broadcast.emit('chat', message);
	});
});