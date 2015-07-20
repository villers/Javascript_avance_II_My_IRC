/// <reference path="../../server/all.d.ts" />

module irc {
	'use strict';

	export class MainCtrl {
		static $inject = [];

		private socket;
		public logged: boolean = false;
		public login: Login;

		public channels: Channel[];
		public selectedChan: Channel;

		public constructor() {
			this.socket = io.connect('http://127.0.0.1:3333');
			this.socket.on('connect', () => {
				this.socket.on('logged', (user: User) => {
					this.channels = [];
					this.channels.push(new Channel(this.login.channel, user));
					console.log(this.channels)
				});

				this.socket.on('newUser', (user: any, channelName: string, debug: string) => {
					console.log(user, channelName, debug);
					//this.channels[channelName].users[user.id] = user;

					//if (user.username == _user.username) {
					//	$('#' + user.id).addClass('active');
					//}
				});

			});
		}

		public doLogin() {
			this.socket.emit('login', {username: this.login.username, channelname: this.login.channel});
			this.logged = true;
		}

		public selectChan(key: number) {
			this.selectedChan = this.channels[key];
		}


	}

	angular.module('irc', ['ngSanitize', 'ngStorage', 'ui.bootstrap'])
		.controller('MainCtrl', MainCtrl);

}
