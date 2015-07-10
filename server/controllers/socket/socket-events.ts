/// <reference path="../../all.d.ts" />

// client.emit -> only me
// client.broadcast.to(_channelName).emit ->  all in a channel without me
// io.broadcast.to(socketid).emit -> One user with specific id
// io.in(_channelName).emit -> all in a channel with me

"use strict";
import {User} from '../../entities/user';
import {Room} from '../../entities/room';
export class SocketEvents
{
	static init(io: any): void
	{
		var _rooms: Room[] = [];

		// quand la connexion socket.io est réussi
		io.on('connection', function(client: any)
		{
			var _user: User;
			var _channelName: string;

			// quand un nouveau client ce connecte avec un login et un channel
			client.on('login', (signInfos: ISignInfos) => {

				// création de l'utilisateur
				_user = new User(client.id, signInfos.username);

				// création de la room ou ajout de l'utilisateur dans la room
				_channelName = signInfos.channelname;
				if (!_rooms[_channelName]) {
					_rooms[_channelName] = new Room(_channelName, _user);
				} else {
					_rooms[_channelName].addUser(_user);
				}

				// le client rejoin le channel
				client.join(_channelName);

				// envoi d'un message a l'utilisateur pour dire que la connexion a réussi
				client.emit('logged', _user.toJson());
				console.log('user: ' + _user.username + ' joined #' + _channelName);

				// envoi de l'utilisateur a tous les autres
				client.broadcast.to(_channelName).emit('newUser', _user.toJson());

				// envois tous les utilisateurs a l'utilisateur courant
				for (var k in _rooms[_channelName].users) {
					client.emit('newUser', _rooms[_channelName].users[k].toJson());
				}
			});

			client.on('sendMessage', (message: any) => {
				console.log(message);
				if (message !== '') {
					io.in(_channelName).emit('recevMessage', _user.toJson(), message);
				}
			});

			client.on('disconnect', () => {
				if (!_user) {
					return false;
				}

				delete _rooms[_channelName].removeUser(_user.id);
				io.in(_channelName).emit('logout', _user.toJson());
				console.log('Logout: ', _user.username);
			})
		});
	}
}
