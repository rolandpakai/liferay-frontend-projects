/**
 * SPDX-FileCopyrightText: © 2017 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import {PluginLogger, Project} from 'liferay-js-toolkit-core';
import path from 'path';

import loader from '../index';

const project = new Project('.');

const savedProjectPath = project.dir.asNative;

beforeEach(() => {
	project.loadFrom(path.join(__dirname, '..', '..'));
});

afterEach(() => {
	project.loadFrom(savedProjectPath);
});

const TEST_JS = 'const x = 1;';

it('logs results correctly', () => {
	const context = {
		content: TEST_JS,
		filePath: 'file.js',
		log: new PluginLogger(),
		extraArtifacts: {},
	};

	loader(context, {presets: ['es2015']});

	expect(context.log.messages).toEqual([
		{
			level: 'info',
			source: 'babel-loader',
			things: ['Transpiled file'],
		},
	]);
});

it('correctly transpiles JS code', () => {
	const context = {
		content: TEST_JS,
		filePath: 'file.js',
		log: new PluginLogger(),
		extraArtifacts: {},
	};

	const result = loader(context, {presets: ['es2015']});

	expect(result).toEqual(`"use strict";

var x = 1;`);

	expect(Object.keys(context.extraArtifacts)).toEqual(['file.js.map']);
	expect(JSON.parse(context.extraArtifacts['file.js.map'])).toEqual({
		version: 3,
		sources: ['file.js'],
		names: ['x'],
		mappings: ';;AAAA,IAAMA,IAAI,CAAV',
		file: 'file.js',
		sourcesContent: ['const x = 1;'],
	});
});