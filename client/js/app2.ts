/// <reference path="../../server/all.d.ts" />

module irc {
	'use strict';

	export interface IMyScope extends angular.IScope{
		logged: boolean;
		login: Login;
		channels: IChannels<Channel>; // Channel[]
		channelSelected: Channel;
		text: string;

		doLogin(): void;
		selectChan(channel: Channel): void;
		equals(arg1: any, arg2: any): boolean;
		send():void;
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
				this.socket.on('logged', (user: User, channelName: string) => {
					$scope.login.id = user.id;
					$scope.channels[channelName] = new Channel(channelName, user);
					$scope.channelSelected = $scope.channels[channelName];
					$scope.$apply();
				});

				this.socket.on('newUser', (user: User, channelName: string, debug: string) => {
					var users: any = $scope.channels[channelName].findUser(user);
					if (users.length == 0) {
						$scope.channels[channelName].users.push(user);
					}
					$scope.$apply();
				});

				this.socket.on('sendMessage', (user: any, channelName: string, message: string, info: boolean) => {
					$scope.channels[channelName].messages.push({user: user, str: message, info: info});
					$scope.$apply();
					MainCtrl.scrollBottom($('#scroll-message'));
				});

				this.socket.on('renameUser', (user: any, channelName: string) => {
					var users: any = $scope.channels[channelName].findUser(user);
					users.forEach((element: User) => {
						element.username = user.username;
					});
					$scope.$apply();
				});

				this.socket.on('leaveChannel', (message: any, channelName: string) => {
					delete $scope.channels[channelName];
					delete $scope.channelSelected;
					for (var key in $scope.channels) {
						$scope.channelSelected = $scope.channels[key];
					}
					$scope.$apply();
					MainCtrl.scrollBottom($('#scroll-message'));
				});

				this.socket.on('logout', (user: any, channelName: string) => {
					if ($scope.channels[channelName]) {
						$scope.channels[channelName].deleteUser(user);
					}
					$scope.$apply();
				});

			});

			$scope.send = () => {
				var channel: string = ($scope.channelSelected == undefined) ? $scope.login.channel : $scope.channelSelected.name;
				this.socket.emit('sendMessage', $scope.text, channel);
				$scope.text = '';
			};

			$scope.doLogin = () => {
				this.socket.emit('login', {username: $scope.login.username, channelname: $scope.login.channel});
				$scope.logged = true;
			};

			$scope.selectChan = (channel: Channel) => {
				$scope.channelSelected = channel;
			};

			$scope.equals = (arg1: any, arg2: any) => {
				return angular.equals(arg1, arg2);
			};
		}

		static scrollBottom(element: JQuery) {
			element.animate({"scrollTop": element[0].scrollHeight}, "slow");
		}
	}

	angular.module('irc', ['ngSanitize', 'ngStorage', 'ui.bootstrap'])
		.controller('MainCtrl', MainCtrl);

}
