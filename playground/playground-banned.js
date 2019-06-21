'use strict';

const Fanfou = require('fanfou-sdk');
const opt = require('../config/sdk');
const {isBanned} = require('../utils/fanfou');

const ff = new Fanfou(opt);

(async () => {
	const timeline = await ff.get('/statuses/user_timeline', {id: 'ifanfou'});

	timeline.forEach(status => {
		if (!isBanned(status)) {
			console.log(status.plain_text);
		}
	});
})();
