/// <reference path="../all.d.ts" />
import {User} from './user';
export class Room {
	name: string;
	owner: User;
	users: User[];

	constructor(name: string, owner: User) {
		this.name = name;
		this.owner = owner;
		this.users = [];

		this.addUser(owner);
	}

	public addUser(user: User): void {
		var nbUserWithSameName: number = 0;
		for (let key in this.users) {
			if (this.users.hasOwnProperty(key) && this.users[key].username === user.username) {
				nbUserWithSameName++;
				for (let key2 in this.users) {
					if (this.users.hasOwnProperty(key2) && this.users[key2].username === user.username + nbUserWithSameName) {
						nbUserWithSameName++;
					}
				}
			}
		}
		if (nbUserWithSameName !== 0) {
			user.username += nbUserWithSameName;
		}
		this.users[user.id] = user;
	}

	public getListUser(): any[] {
		var result: any[] = [];
		this.users.forEach((user: any) => {
			var tmp = {
				id: user.id,
				username: user.username
			};
			result.push(tmp);
		});
		return result;
	}

	public getNbUser(): number {
		return Object.keys(this.users).length;
	}

	public removeUser(id: string): void {
		if (this.users[id]) {
			delete this.users[id];
		}
	}

	public toJson(): Object {
		return {
			name: this.name,
			users: this.getListUser()
		};
	}
}
