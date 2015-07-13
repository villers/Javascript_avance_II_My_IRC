/// <reference path="../../all.d.ts" />

// client.emit -> only me
// client.broadcast.to(_channelName).emit ->  all in a channel without me
// client.broadcast.to(socketid).emit -> One user with specific id
// io.in(_channelName).emit -> all in a channel with me

"use strict";
import {User} from '../../entities/user';
import {Room} from '../../entities/room';
import {Command} from '../../entities/command';
export class SocketEvents
{
	static init(io: any): void
	{
		var _rooms: Room[] = [];

		// quand la connexion socket.io est réussi
		io.on('connection', function(client: any)
		{
			var _user: User;
			var _commands: Command = new Command(io, client);

			// quand un nouveau client ce connecte avec un login et un channel
			client.on('login', (signInfos: ISignInfos) => {
				// création de l'utilisateur
				_user = new User(client.id, signInfos.username, signInfos.channelname);

				// création de la room ou ajout de l'utilisateur dans la room
				SocketEvents.login(_rooms, _user, client);
			});

			client.on('sendMessage', (message: any) => {
				_commands.rooms = _rooms;
				message = _commands.parseChat(_rooms[_user.channelname], _user, message).trim();
				if (message !== '') {
					io.in(_user.channelname).emit('recevMessage', _user.toJson(), message);
				}
			});

			client.on('disconnect', () => {
				if (!_user) {
					return false;
				}

				SocketEvents.leaveChan(_rooms, _user.channelname, _user, client, io);
				console.log('Logout: ', _user.username);
			})
		});
	}

	static login(rooms: Room[], user: User, client) {
		if (!rooms[user.channelname]) {
			rooms[user.channelname] = new Room(user.channelname, user);
		} else {
			rooms[user.channelname].addUser(user);
		}

		// le client rejoin le channel
		client.join(user.channelname);

		// envoi d'un message a l'utilisateur pour dire que la connexion a réussi
		client.emit('logged', user.toJson());
		console.log('user: ' + user.username + ' joined #' + user.channelname);

		// envoi de l'utilisateur a tous les autres
		client.broadcast.to(user.channelname).emit('newUser', user.toJson(), 'other client');

		// envois tous les utilisateurs a l'utilisateur courant
		console.log(rooms[user.channelname].users);
		for (var k in rooms[user.channelname].users) {
			console.log("send 1 client\n -----------------");
			client.emit('newUser', rooms[user.channelname].users[k].toJson(), 'local client');
		}
	}

	static leaveChan(rooms: Room[], channelName: string, user: User, client, io) {
		if (rooms[channelName]) {
			rooms[channelName].removeUser(user.id);
			if (rooms[channelName].getNbUser() <= 0) {
				delete rooms[channelName];
			}
		}

		user.channelname = '';

		client.leave(channelName);
		io.in(channelName).emit('logout', user.toJson());
	}
}
