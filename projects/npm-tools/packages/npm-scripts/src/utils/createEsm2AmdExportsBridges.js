/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

/* eslint-disable @liferay/no-dynamic-require */

const {
	addNamespace,
	joinModuleName,
	splitModuleName,
} = require('@liferay/js-toolkit-core');
const fs = require('fs');
const path = require('path');
const resolve = require('resolve');

const flattenPkgName = require('./flattenPkgName');

/**
 * Create .js files to make ES modules available as Liferay-AMD modules.
 *
 * @param {string} projectDir path to project's directory
 * @param {string} outDir path to output directory
 * @param {{bridge: boolean, package: string}[]} exports
 */
function createEsm2AmdExportsBridges(projectDir, outDir, exports) {
	exports.forEach((exportItem) => {
		const {pkgName, scope} = splitModuleName(exportItem.package);

		const scopedPkgName = joinModuleName(scope, pkgName, '');

		const rootPkgJson = require(path.join(projectDir, 'package.json'));

		const namespacedScopedPkgName = addNamespace(
			scopedPkgName,
			rootPkgJson
		);

		const pkgJson = require(resolve.sync(`${scopedPkgName}/package.json`, {
			basedir: projectDir,
		}));

		const packageDir = path.join(
			outDir,
			'node_modules',
			getPackageTargetDir({
				name: namespacedScopedPkgName,
				version: pkgJson.version,
			})
		);

		fs.mkdirSync(packageDir, {recursive: true});

		fs.writeFileSync(
			path.join(packageDir, 'package.json'),
			JSON.stringify(
				{
					dependencies: {},
					main: './index.js',
					name: namespacedScopedPkgName,
					version: pkgJson.version,
				},
				null,
				'\t'
			),
			'utf8'
		);

		const webContextPath = getBndWebContextPath() || `/${rootPkgJson.name}`;

		const rootDir = exportItem.package.startsWith('@')
			? `../../../..${webContextPath}`
			: `../../..${webContextPath}`;

		const flattenedPkgName = flattenPkgName(exportItem.package);

		const bridgeSource = `
import * as esModule from "${rootDir}/__liferay__/exports/${flattenedPkgName}.js";

Liferay.Loader.define(
	"${namespacedScopedPkgName}@${pkgJson.version}/index",
	['module'], 
	function (module) {
		module.exports = esModule;
	}
);
`;

		fs.writeFileSync(
			path.join(packageDir, 'index.js'),
			bridgeSource,
			'utf8'
		);
	});
}

function getPackageTargetDir(pkgJson) {
	const {name, version} = pkgJson;

	let targetFolder = name.replace('/', '%2F');

	if (version) {
		targetFolder += `@${version}`;
	}

	return targetFolder;
}

function getBndWebContextPath() {
	const bndFile = path.resolve('bnd.bnd');

	if (fs.existsSync(bndFile)) {
		const bnd = fs.readFileSync(bndFile, 'utf8');

		const lines = bnd.split('\n');

		const webContextPathLine = lines.find((line) =>
			line.startsWith('Web-ContextPath:')
		);

		if (webContextPathLine !== undefined) {
			return webContextPathLine.substring(16).trim();
		}
	}

	return undefined;
}

module.exports = createEsm2AmdExportsBridges;
