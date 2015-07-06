/// <reference path="../all.d.ts" />
interface IUser {
	id: number;
	name: string;

}

class User implements IUser{
	id:number;
	name:string;

	constructor(name: string) {
		this.name = name;
	}
}
