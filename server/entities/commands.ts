/// <reference path="../all.d.ts" />

export class Commands {
	description: string;
	callback: any;

	constructor(description: string, callback: any) {
		this.description = description;
		this.callback = callback;
	}
}
