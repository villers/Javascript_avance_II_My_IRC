/// <reference path="../../server/all.d.ts" />

module irc {
	'use strict';

	export interface IChannels<Channel> {
		[x: string]: Channel;
	}

	export class Channel {
		constructor(name:string, user:User) {
			this.name = name;
			this.users = [user];
		}

		name:string;
		users:User[];
	}
}
