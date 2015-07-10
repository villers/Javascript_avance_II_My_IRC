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

var doLogin = $('#doLogin');
doLogin.on('submit', (e: any) => {
	e.preventDefault();

	socket.emit('login', {username: $('#username').val(), channelname: $('#channel').val()});
});

socket.on('connect', () => {
	var _user: any;
	socket.on('logged', (user: any) => {
		_user = user;
		$('#login').hide();
		$('#connected').show();
	});

	socket.on('newUser', (user: any) => {
		$('#users').append(template_chat(user));
		$('#nbOnline').html(template_nbOnline({nbOnline: $('.user-row').length}));
	});

	socket.on('recevMessage', (user: any, message: string) => {
		$('#messages').append(template_message({username: user.username, message: message}));
		console.log(user, message);
	});

	socket.on('logout', (user: any) => {
		console.log($('#' + user.id));
		$('#' + user.id).remove();
	});
});

