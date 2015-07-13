/// <reference path="../../server/all.d.ts" />

var parse = (text: string): string => {
	var emoticones = [
		[':\\\)', 'smile.png'],
		[':\\\(', 'frown.png']
	];
	text = Handlebars.Utils.escapeExpression(text);
	for(var i = 0; i < emoticones.length; i++){
		var template_img = Handlebars.compile('<img src="img/smiley/' + emoticones[i][1] + '">');
		text = text.replace(new RegExp(emoticones[i][0], 'gi'), template_img);
	}
	return text;
};

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

$("body").on("click", ".user", (element: any) => {
	textbox.val('/msg ' + element.currentTarget.childNodes[0].data + ' ');
	textbox.focus();
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
	// TODO: check this fucking bugs
	socket.on('newUser', (user: any, debug: string) => {
		console.log(user, debug);
		$('#users').append(template_chat(user));
		$('#nbOnline').html(template_nbOnline({nbOnline: $('.user').length}));
		if (user.username == _user.username) {
			$('#' + user.id).addClass('active');
		}
	});

	// when a new message received
	socket.on('recevMessage', (user: any, message: string) => {
		$('#messages').append(template_message({username: user.username, message: new Handlebars.SafeString(parse(message))}));
	});

	// when a error message received
	socket.on('warn', (message: string) => {
		$('#messages').append(template_warn_message({message: message}));
	});

	// when a user has renamed
	socket.on('renameUser', (user: any) => {
		$('#name-' + user.id).text(user.username);
	});

	socket.on('leaveChannel', (user: any) => {
		$('#messages')
			.append(template_warn_message({message: 'Your are leave the channel' + user.channelname}))
			.append(template_warn_message({message: 'You must use command /join'}));
		$('#users').html("");
		$('#nbOnline').html(template_nbOnline({nbOnline: 0}));
		$('#channelName').text('Not connected');
	});

	// when a user Sign out
	socket.on('logout', (user: any) => {
		$('#' + user.id).remove();
		$('#nbOnline').html(template_nbOnline({nbOnline: $('.user').length}));
	});
});
