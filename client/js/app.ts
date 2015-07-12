/// <reference path="../../server/all.d.ts" />

var template_message = Handlebars.compile($("#message-template").html());
var template_warn_message = Handlebars.compile($("#warn-message-template").html());
var template_chat = Handlebars.compile($("#user-template").html());
var template_nbOnline = Handlebars.compile($('#nbOnline-template').html());

// socket Connexion
var socket = io.connect('http://localhost:3333');

// Event Send Message
var textbox = $('#textbox');
$('#send').click(() => {
	socket.emit('sendMessage', textbox.val());
	textbox.val('');
});
textbox.keypress(function(e) {
	if(e.which == 13) {
		socket.emit('sendMessage', textbox.val());
		textbox.val('');
	}
});

// connection
var doLogin = $('#doLogin');
doLogin.on('submit', (e: any) => {
	e.preventDefault();
	socket.emit('login', {username: $('#username').val(), channelname: $('#channel').val()});
});

// Socket Io
socket.on('connect', () => {
	var _user: any;
	// when logged
	socket.on('logged', (user: any) => {
		_user = user;
		$('#login').hide();
		$('#connected').show();
		$('#channelName').text('#' + user.channelname);
	});

	// when a new user connected
	socket.on('newUser', (user: any) => {
		$('#users').append(template_chat(user));
		$('#nbOnline').html(template_nbOnline({nbOnline: $('.user-row').length}));
	});

	// when a new message received
	socket.on('recevMessage', (user: any, message: string) => {
		$('#messages').append(template_message({username: user.username, message: message}));
	});

	// when a error message received
	socket.on('unrecogised', (user: any, message: string) => {
		$('#messages').append(template_message({username: user.username, message: message}));
	});

	// when a user has renamed
	socket.on('renameUser', (user: any) => {
		$('#name-' + user.id).text(user.username);
	});

	socket.on('listOfChan', (channels: String[]) => {
		var message = 'List of channels: ' + channels.join(', ')+'.';
		$('#messages').append(template_warn_message({message: message}));
	});

	// when a user Sign out
	socket.on('logout', (user: any) => {
		$('#' + user.id).remove();
	});
});

