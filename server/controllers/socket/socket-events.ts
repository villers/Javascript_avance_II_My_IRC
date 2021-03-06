/// <reference path="../../all.d.ts" />

// client.emit -> only me
// client.broadcast.to(_channelName).emit ->  all in a channel without me
// client.broadcast.to(socketid).emit -> One user with specific id
// io.in(_channelName).emit -> all in a channel with me

'use strict';

import {User} from '../../entities/user';
import {Room} from '../../entities/room';
import {Command} from '../../entities/command';

export class SocketEvents {
	static init(io: any): void {
		var _rooms: Room[] = [];

		// quand la connexion socket.io est réussi
		io.on('connection', function(client: any) {
			var _user: User;
			var _commands: Command = new Command(io, client);

			// quand un nouveau client ce connecte avec un login et un channel
			client.on('login', (signInfos: ISignInfos) => {
				// création de l'utilisateur
				_user = new User(client.id, signInfos.username, signInfos.channelname);

				// création de la room ou ajout de l'utilisateur dans la room
				SocketEvents.login(_rooms, _user, signInfos.channelname, client, io);
			});

			client.on('sendMessage', (message: any, channelName: string) => {
				_commands.rooms = _rooms;
				message = _commands.parseChat(_rooms[channelName], _user, message).trim();
				if (message !== '') {
					console.log(message, channelName);
					io.in(channelName).emit('sendMessage', _user.toJson(), channelName, message, false);
				}
			});

			client.on('disconnect', () => {
				if (!_user) {
					return false;
				}

				_user.channelname.forEach((channelName: string) => {
					SocketEvents.leaveChan(_rooms, channelName, _user, client, io);
				});
			});
		});
	}

	static login(rooms: Room[], user: User, channelName: string, client: any, io: any) {
		if (!rooms[channelName]) {
			rooms[channelName] = new Room(channelName, user);
		} else {
			rooms[channelName].addUser(user);
		}

		// le client rejoin le channel
		client.join(channelName);

		// envoi d'un message a l'utilisateur pour dire que la connexion a réussi
		client.emit('logged', user.toJson(), channelName);
		console.log('user: ' + user.username + ' joined #' + channelName);

		// envoi de l'utilisateur a tous les autres
		client.broadcast.to(channelName).emit('newUser', user.toJson(), channelName, 'other client');
		io.in(channelName).emit('sendMessage', user.toJson(), channelName, user.username + ' has joined the channel.\n', true);

		// envois tous les utilisateurs a l'utilisateur courant
		console.log(rooms[channelName].users);
		for (var k in rooms[channelName].users) {
			if (rooms[channelName].users.hasOwnProperty(k)) {
				client.emit('newUser', rooms[channelName].users[k].toJson(), channelName, 'local client');
			}
		}
	}

	static leaveChan(rooms: Room[], channelName: string, user: User, client: any, io: any) {
		io.in(channelName).emit('logout', user.toJson(), channelName);
		io.in(channelName).emit('sendMessage', user.toJson(), channelName, user.username + ' has leaved the channel.\n', true);
		client.leave(channelName);
		console.log('Logout: ', user.username, channelName);

		if (rooms[channelName]) {
			rooms[channelName].removeUser(user.id);
			if (rooms[channelName].getNbUser() <= 0) {
				delete rooms[channelName];
			}
		}
	}
}
