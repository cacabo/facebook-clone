const path = require('path');
const express = require('express');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;
const api = require('./backend/routes');
const bodyParser = require('body-parser');
const socket = require('socket.io')();
socket.listen(8000);

// Express sessions configuration
app.set('trust proxy', 1);
app.use(session({
  secret: 'perky puppy',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Middleware to use
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve the api
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
	//TODO pull from database all chats pertaining to user and connect to them here

	// Listens for new messages
	socket.on('message', (message) => {
		const messageData = JSON.parse(message);
		const room = messageData.room;

		console.log("Broadcast reached " + message.body + " " + room);
		socket.broadcast.to(room).emit('message', message);
	});

	// Detects invite notifications
	socket.on('invite', (data) => {
		const rooms = JSON.parse(data);

		//below is temporary for testing purposes since will have to already be part of a room to invite someone.
		socket.join(rooms.roomToJoin);
		socket.broadcast.to(rooms.roomToReceive).emit('invite', data);
	});

	// Joins a room
	socket.on('joinRoom', (room) => {
		console.log("joined room " + room);
		socket.join(room);
	});

	// Leaves a room
	socket.on('leaveRoom', (room) => {
		socket.broadcast.to(room).emit('message', "left room");
		socket.leave(room);
	});

	// For creating a new room when thid person joins
	socket.on('autoJoin', (data) => {
		const rooms = JSON.parse(data);

		socket.join(room);
		console.log("auto joined room " + room);
	});
});
