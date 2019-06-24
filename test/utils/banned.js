'use strict';

const test = require('ava');
const clearModule = require('clear-module');
const mock = require('mock-require');

let isBannedFunc;

const mockBanned = {
	BOTS: ['unicorn-bot'],
	BLACKLIST: ['unicorn-blacklist'],
	APP: ['unicorn-app'],
	TOPIC: ['unicorn-topic'],
	REGEX: ['unicorn-.+']
};

const setupTest = () => {
	try {
		['../../utils/fanfou', '../../config/banned'].forEach(clearModule);
	} catch {}

	mock('../../config/banned', mockBanned);
	const {isBanned} = require('../../utils/fanfou');
	isBannedFunc = isBanned;
};

test.beforeEach(setupTest);

test.afterEach(() => {
	mock.stopAll();
});

/* eslint-disable-next-line camelcase */
const defaultStatus = {user: {}, txt: [{type: 'at'}, {type: 'tag', text: ''}], plain_text: ''};

test('matched by user id in bots', t => {
	const status = {...defaultStatus, user: {id: 'unicorn-bot'}};

	t.true(isBannedFunc(status));
});

test('matched by user id in blacklist', t => {
	const status = {...defaultStatus, user: {id: 'unicorn-blacklist'}};

	t.true(isBannedFunc(status));
});

test('matched by user unique id', t => {
	/* eslint-disable-next-line camelcase */
	const status = {...defaultStatus, user: {unique_id: 'unicorn-bot'}};

	t.true(isBannedFunc(status));
});

test('matched by app name', t => {
	/* eslint-disable-next-line camelcase */
	const status = {...defaultStatus, source_name: 'unicorn-app'};

	t.true(isBannedFunc(status));
});

test('matched by topic', t => {
	const status = {...defaultStatus, txt: [{type: 'tag', text: '#unicorn-topic#'}]};

	t.true(isBannedFunc(status));
});

test('matched by regex', t => {
	/* eslint-disable-next-line camelcase */
	const status = {...defaultStatus, plain_text: 'unicorn-regex'};

	t.true(isBannedFunc(status));
});

test('no matched', t => {
	t.false(isBannedFunc(defaultStatus));
});

