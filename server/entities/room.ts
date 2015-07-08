/// <reference path="../all.d.ts" />
import {User} from './user';
export class Room {
	name: string;
	owner: User;
	users: User[];
	private: boolean;

	constructor(name: string, owner: User) {
		this.name = name;
		this.owner = owner;
		this.users = [];
	}

	addUser(user: User): void {
		this.users.push(user);
	}

	getUser(id: string): User {
		this.users.forEach((element: User, index: number) => {
			if(element.id == id) {
				return element;
			}
		});
		return undefined;
	}

	getListUser(): any[] {
		var result: any[] = [];
		this.users.forEach((user: any)=> {
			var tmp = {
				id: user.id,
				username: user.username
			};
			result.push(tmp);
		});
		return result;
	}

	isPrivate(): boolean {
		return this.private;
	}

	removeUser(id: string): void {
		this.users.forEach((element: User, index: number) => {
			if(element.id == id) {
				this.users.splice(index, 1);
			}
		});
	}

	toJson(): Object {
		return {
			name: this.name,
			users: this.getListUser()
		};
	}
}
