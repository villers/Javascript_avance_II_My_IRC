/// <reference path="../../all.d.ts" />

'use strict';

import * as express from 'express';

export class StaticDispatcher {
	static init(app: any): void {
		app.use('/', express.static(process.cwd() + '/client/'));
		app.get('/', (req: any, res: any) => {
			res.sendfile(__dirname + '/client/index.html');
		});
	}
}
