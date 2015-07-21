/// <reference path="../../../server/all.d.ts" />

module irc {
	'use strict';

	export interface IChannels<Channel> {
		[x: string]: Channel;
	}

	export class Channel {
		constructor(name:string, user:User) {
			this.name = name;
			this.users = [user];
			this.messages = [];
		}

		name:string;
		users:User[];
		messages:Message[];

		findUser(user): any {
			return this.users.filter((element: User) => {
				return (element.id == user.id);
			});
		}

		deleteUser(user): any {
			return this.users.forEach((element: User, index: number) => {
				if (element.id == user.id) {
					this.users.splice(index, 1);
				}
			});
		}
	}
}
