/// <reference path="../all.d.ts" />

import {Room} from './room';
import {User} from './user';
import {Commands} from './commands';
import {SocketEvents} from './../controllers/socket/socket-events';

export class Command {
	io: any;
	client: any;
	commands: Commands[];
	rooms: Room[] = [];

	constructor(io: any, client: any) {
		this.commands = [];
		this.io = io;
		this.client = client;

		this.registerCommand('nick', 'Change nickname', (currentRoom: Room, user: User, args: string[]): string => {
			if (args[0] && user.channelname !== '') {
				user.username = args[0];
				currentRoom.users[user.id].username = args[0];
				io.in(currentRoom.name).emit('renameUser', user.toJson());
			}
			return '';
		});

		this.registerCommand('list', 'List Channels', (currentRoom: Room, user: User, args: string[]): string => {
			var result: any = [];
			for (var room in this.rooms) {
				if (args[0] === undefined || (args[0] && room.indexOf(args[0]) > -1)) {
					result.push(room);
				}
			}

			client.emit('listOfChan', result);
			return '';
		});

		this.registerCommand('join', 'Join a Channel', (currentRoom: Room, user: User, args: string[]): string => {
			console.log(user.channelname);
			if (args[0] && user.channelname == '') {
				user.channelname = args.join(' ');
				SocketEvents.login(this.rooms, user, client);
			}
			return '';
		});

		this.registerCommand('part', 'Leave a Channel', (currentRoom: Room, user: User, args: string[]): string => {
			if (!user) {
				return '';
			}

			client.emit('leaveChannel', user);
			SocketEvents.leaveChan(this.rooms, currentRoom.name, user, client, io);
			console.log('Client: '+ user.username +' leave channel : ', currentRoom.name);
			return '';
		});

		this.registerCommand('users', 'List Users in channel', (currentRoom: Room, user: User, args: string[]): string => {
			if (user.channelname !== '') {
				var result:any = [];
				for (var usersId in currentRoom.users) {
					var username = currentRoom.users[usersId].username;
					if (args[0] === undefined || (args[0] && username.indexOf(args[0]) > -1)) {
						result.push(username);
					}
				}

				client.emit('listOfUsers', result);
			}
			return '';
		});

		this.registerCommand('msg', 'Send a private message', (currentRoom: Room, user: User, args: string[]): string => {
			if (args[0] && args[1] && user.channelname !== '') {
				for (var usersId in currentRoom.users) {
					if (currentRoom.users[usersId].username == args[0]) {
						args.shift();
						client.broadcast.to(usersId).emit('recevMessage', user, args.join(' '));
					}
				}
			}
			return '';
		});
	}

	public registerCommand(name: string, description: string, callback: any) {
		this.commands[name] = new Commands(description, callback);
	}

	public parseChat(currentRoom: Room, user: User, message: string): string {
		if (message.indexOf('/') == 0) {
			var args = message.substring(1).split(' ');
			if (this.commands[args[0]]) {
				message = this.commands[args[0]].callback(currentRoom, user, args.slice(1));
			} else {
				var error = 'unrecognized command: ' + message;
				this.client.emit('unrecognized', user, error);
				message = '';
				console.log(error);
			}
		}
		return message;
	}
}
