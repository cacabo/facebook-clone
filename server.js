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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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
	//socket.id = client's id

	//pull from database all chats pertaining to user and connect to them
    socket.join('username')

    //maybe have info of which room message came from in message json
    //emit only to that room once query room out of JSON object
	socket.on('message', (message) => {
		const messageData = JSON.parse(message);
		const room = messageData.room;

		console.log("Broadcast reached " + message.body + " " + room);
		socket.broadcast.to(room).emit('message', message);
	});

	//hardcoded for now - username
	socket.on('invite', (data) => {
		const rooms = JSON.parse(data);
		socket.join(rooms.roomToReceive);
		socket.broadcast.to(rooms.roomToReceive).emit('invite', data);
	});

	socket.on('joinRoom', (room) => {
		socket.join(room);
		console.log("joined room " + room);
	});

	socket.on('leaveRoom', (room) => {
		socket.leave(room);

		//emit the fact that this user has left the room
	});
});

