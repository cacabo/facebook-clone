
import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:8000');

// Listens to messages
function subscribeToMessages(cb) {
  socket.on('message', (message) => {
  	cb(message);
  });
}

// Listens for invitations
function subscribeToInvitations(username, cb) {
	// User is part of a specialized room for receving invitations
  console.log("Received Invite");
  socket.emit('joinRoom', username + 'inviteRoom');
  socket.on('invite', (data) => {
  	cb(data);
  });
}

// Listens for when to reload list of chats on client side
function subscribeToReloadChats(cb) {
  socket.on('reloadChat', (reload) => {
  	cb(reload);
  });
}

// Reloads chat list
function reloadChatList(cb) {
  socket.emit('reloadChat', true);
  cb();
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
function invite(room, roomToReceive, chatTitle, username, inviter, autoJoin, cb) {
  const params = {
  	autoJoin: autoJoin,
  	sender: inviter,
  	roomToReceive: roomToReceive,
  	roomToJoin: room,
  	chatTitle: chatTitle,
  	users: [],
  };

  socket.emit('invite', JSON.stringify(params));
  cb();
}

// Joins a room
function joinRoom(room, cb) {
  socket.emit('joinRoom', room);
  cb();
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
	subscribeToReloadChats,
	reloadChatList,
};
