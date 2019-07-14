'use strict';

const Fanfou = require('fanfou-sdk');
const opt = require('../config/sdk');

const ff = new Fanfou(opt);

(async () => {
	// Get user info from @bing-wallpaper
	const id = 'bing-wallpaper';
	const user = await ff.get('/users/show', {id});
	const {statuses_count: statusCount} = user;
	const pageCount = Math.ceil(statusCount / 60);
	const pages = Array.from({length: pageCount}, (v, i) => i + 1);
	const requests = pages.map(page => ff.get('/statuses/user_timeline', {id, page, count: 60}));
	const allStatuses = await Promise.all(requests);
	const screenNames = allStatuses.flat().map(status => status.user.screen_name);
	console.log([...new Set(screenNames)]);
})();
