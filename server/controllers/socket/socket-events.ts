/// <reference path="../../all.d.ts" />

"use strict";
import {User} from '../../entities/user';
import {Room} from '../../entities/room';
export class SocketEvents
{
	static init(io: any): void
	{
		var _users: User[] = [];
		io.on('connection', function(client: any)
		{
			var _user: User;
			var _room: Room;
            console.log('connected');
			client.on('signIn', (signInfos: ISignInfos) => {
				_user = new User(client.id, signInfos.userName);
				_users.push(_user);

				_room = new Room(signInfos.channelName, _user);
				_room.addUser(_user);

				client.join(_room.name);
				console.log(_user.username + ' joined #' + _room.name + _users.length);
				io.in(_room.name).emit('sendUserList', _room.getListUser(), _users.length);
			});


			client.on('sendMessage', (message: any) => {
				console.log(message);
				if (message !== '') {
					io.in(_room.name).emit('sendMessageToClients', _user.toJson(), message);
				}
			});

			client.on('disconnect', () => {
				io.in(_room.name).emit('logout', _user)
			})
		});
	}
}
