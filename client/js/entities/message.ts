/// <reference path="../../../server/all.d.ts" />

module irc {
	'use strict';

	export class Message {
		user: User;
		str: string;
		info: boolean;
	}
}
