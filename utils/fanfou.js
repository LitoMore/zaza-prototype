'use strict';

const banned = require('../config/banned');

const isBanned = status => {
	const {BOTS, BLACKLIST, APP, TOPIC, REGEX} = banned;
	for (const id of BOTS.concat(BLACKLIST)) {
		if (id === status.user.id || id === status.user.unique_id) {
			return true;
		}
	}

	for (const appName of APP) {
		if (appName === status.source_name) {
			return true;
		}
	}

	for (const tag of TOPIC) {
		const tags = status.txt.filter(item => item.type === 'tag').map(item => item.text);
		for (const tagName of tags) {
			if (tagName.replace(/#/g, '') === tag) {
				return true;
			}
		}
	}

	for (const pattern of REGEX) {
		const regex = new RegExp(pattern);
		if (status.plain_text.match(regex)) {
			return true;
		}
	}

	return false;
};

module.exports = {
	isBanned
};
