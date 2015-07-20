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

		this.registerCommand('nick', 'Change nickname. /nick _nickname_', (currentRoom: Room, user: User, args: string[]): string => {
			if (args[0] && currentRoom) { // TODO
				user.username = args[0];
				currentRoom.users[user.id].username = args[0];
				io.in(currentRoom.name).emit('renameUser', user.toJson());
			}
			return '';
		});

		this.registerCommand('list', 'Lists the available channels on the server. Displays only the channels containing the "string" if this is specified. /list [string]', (currentRoom: Room, user: User, args: string[]): string => {
			var result: any = [];
			for (var room in this.rooms) {
				if (args[0] === undefined || (args[0] && room.indexOf(args[0]) > -1)) {
					result.push('• ' + room);
				}
			}
			client.emit('warn', 'List of channels:\n' + result.join('\n'));
			return '';
		});

		this.registerCommand('join', 'Join channel. /join _channel_', (currentRoom: Room, user: User, args: string[]): string => {
			console.log(user.channelname);
			if (args[0] && currentRoom) {
				var channelName = args.join(' ');
				user.channelname.push(channelName);
				SocketEvents.login(this.rooms, user, channelName, client);
			}
			return '';
		});

		this.registerCommand('part', 'Leave channel. /part _channel_', (currentRoom: Room, user: User, args: string[]): string => {
			if (!user) {
				return '';
			}

			if (args[0] && currentRoom) {
				var channelName = args.join(' ');
				var message = 'Your are leave the channel ' + channelName + '.\nYou must use command /join';
				client.emit('leaveChannel', message);
				SocketEvents.leaveChan(this.rooms, channelName, user, client, io);
				console.log('Client: '+ user.username +' leave channel : ', channelName);
			}
			return '';
		});

		this.registerCommand('users', 'List users connected to the channel. /users', (currentRoom: Room, user: User, args: string[]): string => {
			if (currentRoom) {
				var result:any = [];
				for (var usersId in currentRoom.users) {
					var username = currentRoom.users[usersId].username;
					if (args[0] === undefined || (args[0] && username.indexOf(args[0]) > -1)) {
						result.push('• ' + username);
					}
				}

				client.emit('warn', 'List of Users:\n' + result.join('\n'));
			}
			return '';
		});

		this.registerCommand('msg', 'Sends a message to a specific user. /msg _nickname_ _message_', (currentRoom: Room, user: User, args: string[]): string => {
			if (args[0] && args[1] && currentRoom) {
				for (var usersId in currentRoom.users) {
					if (currentRoom.users[usersId].username == args[0]) {
						args.shift();
						client.broadcast.to(usersId).emit('recevMessage', user, args.join(' '));
					}
				}
			}
			return '';
		});

		this.registerCommand('help', 'List all commands. /help', (currentRoom: Room, user: User, args: string[]): string => {
			var result = [];

			for (var name in this.commands) {
				result.push('• ' + name + ': '+ this.commands[name].description);
			}

			client.emit('warn', 'List of commands:\n' + result.join('\n'));
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
				var error = 'unrecognized command: ' + message + '.\n You can type /help';
				this.client.emit('warn', error);
				message = '';
				console.log(error);
			}
		}
		return message;
	}
}
