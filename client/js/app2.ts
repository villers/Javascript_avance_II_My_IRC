/// <reference path="../../server/all.d.ts" />

module irc {
	'use strict';

	export interface IMyScope extends angular.IScope{
		logged: boolean;
		login: Login;
		channels: IChannels<Channel>; // Channel[]
		channelSelected: Channel;

		doLogin(): void;
		selectChan(channel: Channel): void;
	}

	export class MainCtrl {
		static $inject = ['$scope'];

		public socket;

		public constructor($scope: IMyScope) {
			this.socket = io.connect('http://127.0.0.1:3333');
			$scope.channels = {};
			$scope.logged = false;
			$scope.login = new Login();

			this.socket.on('connect', () => {
				this.socket.on('logged', (user: User) => {
					$scope.channels[$scope.login.channel] = new Channel($scope.login.channel, user);
					$scope.$apply();
				});

				this.socket.on('newUser', (user: any, channelName: string, debug: string) => {
					//console.log(user, channelName, debug);
					//this.channels[channelName].users[user.id] = user;

					//if (user.username == _user.username) {
					//	$('#' + user.id).addClass('active');
					//}
				});

			});

			$scope.doLogin = () => {
				this.socket.emit('login', {username: $scope.login.username, channelname: $scope.login.channel});
				$scope.logged = true;
			};

			$scope.selectChan = (channel: Channel) => {
				$scope.channelSelected = channel;
			};
		}
	}

	angular.module('irc', ['ngSanitize', 'ngStorage', 'ui.bootstrap'])
		.controller('MainCtrl', MainCtrl);

}
