/// <reference path="../../server/all.d.ts" />

var template_message = Handlebars.compile($("#message-template").html());
var template_chat = Handlebars.compile($("#user-template").html());
var template_nbOnline = Handlebars.compile($('#nbOnline-template').html());

// socket Connexion
var socket = io.connect('http://localhost:3333');

var textbox = $('#textbox');
$('#send').click(() => {
	socket.emit('sendMessage', textbox.val());
	textbox.val('');
});

socket.on('connect', () => {
	console.log('connected');

	socket.emit('signIn', {userName: 'test', channelName: 'chanel1'});

	socket.on('userSignedIn', (user: any) => {
		$('#users').append(template_chat(user));
	});

	socket.on('sendUserList', (users: any, nbOnline: number) => {
		users.forEach((user: any) => {
			$('#users').append(template_chat(user));
			$('#nbOnline').html(template_nbOnline({nbOnline: nbOnline}));
		});
	});

	socket.on('sendMessageToClients', (user: any, message: string) => {
		$('#messages').append(template_message({username: user.username, message: message}));
	});

	socket.on('logout', (user: any) => {
		$('#' + user.id).remove();
		console.log(user, $('#' + user.id));
	});
});

