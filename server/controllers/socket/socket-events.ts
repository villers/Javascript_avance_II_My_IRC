/// <reference path="../../all.d.ts" />

"use strict";

export class SocketEvents
{
	static init(io: SocketIO.Socket): void
	{
		io.on('connection', function(client: SocketIO.Socket)
		{
			client.on('users:online', function()
			{
				io.emit('users:online', 1);
			});
		});
	}
}
