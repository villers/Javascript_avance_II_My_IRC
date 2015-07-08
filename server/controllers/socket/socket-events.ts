/// <reference path="../../all.d.ts" />

"use strict";

export class SocketEvents
{
	static init(io: SocketIO.Socket): void
	{
		io.on('connection', function(client: SocketIO.Socket)
		{
			client.on('signIn', (signInfos: ISignInfos) => {
				console.log(signInfos);
			});
		});
	}
}
