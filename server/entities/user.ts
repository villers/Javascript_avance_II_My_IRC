/// <reference path="../all.d.ts" />
export class User{
	id:string;
	username:string;
	channelname: string[];

	constructor(id: string,username: string, channelname: string) {
		this.id = id;
		this.username = username;
		this.channelname = [channelname];
	}

	toJson(): Object {
		return {
			id: this.id,
			username: this.username,
			channelname: this.channelname
		};
	}
}
