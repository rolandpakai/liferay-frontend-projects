/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

const path = require('path');

const CHECK_AND_FIX_GLOBS = [
	'/*.{js,json,ts}',
	'/{src,test}/**/*.{js,scss,ts,tsx}',
	'/src/**/*.{jsp,jspf}',
];

// Utility for getting paths to @clayui/css variables
// This shouldn't ever fail, but is necessary so that we don't require
// '@clayui/css' as a dependency in this package.

const getClayPaths = () => {
	try {
		return require('@clayui/css').includePaths;
	}
	catch {
		return [];
	}
};

module.exports = {
	build: {
		bundler: {
			'*': {
				'.babelrc': {
					presets: ['liferay-standard'],
				},
				'copy-plugins': ['exclude-imports'],
				plugins: ['replace-browser-modules'],
				'post-plugins': [
					'namespace-packages',
					'inject-imports-dependencies',
					'inject-peer-dependencies',
				],
			},
			'/': {
				'.babelrc': {
					presets: ['liferay-standard'],
				},
				plugins: ['resolve-linked-dependencies'],
				'post-plugins': [
					'namespace-packages',
					'inject-imports-dependencies',
				],
			},
			ignore: ['__generated__/**/*'],
			output: 'build/node/packageRunBuild/resources',
			rules: [
				{
					test: '\\.css$',
					use: ['css-loader'],
				},
				{
					exclude: 'node_modules',
					test: '\\.scss$',
					use: [
						{
							loader: 'css-loader',
							options: {
								extension: '.css',
							},
						},
					],
				},
			],
			sources: ['src/main/resources/META-INF/resources'],
		},

		// Passed to:
		// - `metalsoy` executable (via `generateSoyDependencies()`).

		dependencies: [
			'clay-alert',
			'clay-autocomplete',
			'clay-badge',
			'clay-button',
			'clay-card',
			'clay-card-grid',
			'clay-checkbox',
			'clay-collapse',
			'clay-component',
			'clay-data-provider',
			'clay-dataset-display',
			'clay-dropdown',
			'clay-icon',
			'clay-label',
			'clay-link',
			'clay-list',
			'clay-loading-indicator',
			'clay-management-toolbar',
			'clay-modal',
			'clay-multi-select',
			'clay-navigation-bar',
			'clay-pagination',
			'clay-pagination-bar',
			'clay-portal',
			'clay-progress-bar',
			'clay-radio',
			'clay-select',
			'clay-sticker',
			'clay-table',
			'clay-tooltip',
			'frontend-js-metal-web',
			'frontend-js-react-web',
			'frontend-js-web',
			'frontend-taglib-clay',
			'frontend-taglib',
			'hello-soy-web',
			'metal',
			'metal-affix',
			'metal-ajax',
			'metal-anim',
			'metal-aop',
			'metal-assertions',
			'metal-clipboard',
			'metal-component',
			'metal-debounce',
			'metal-dom',
			'metal-drag-drop',
			'metal-events',
			'metal-incremental-dom',
			'metal-jsx',
			'metal-key',
			'metal-keyboard-focus',
			'metal-multimap',
			'metal-pagination',
			'metal-path-parser',
			'metal-position',
			'metal-promise',
			'metal-router',
			'metal-scrollspy',
			'metal-soy',
			'metal-soy-bundle',
			'metal-state',
			'metal-storage',
			'metal-structs',
			'metal-throttle',
			'metal-toggler',
			'metal-uri',
			'metal-useragent',
			'metal-web-component',
		],

		// Passed to:
		// - `babel` executable (via `runBabel()`).
		// - `jest` executable (via resolver.js).
		// - `metalsoy` executable (via `buildSoy()`).

		input: 'src/main/resources/META-INF/resources',

		// Passed to:
		// - `babel` executable (via `runBabel()`).
		// - `jest` executable (via resolver.js).
		// - `translateSoy()`.
		// - `minify()`.

		output: 'build/node/packageRunBuild/resources',

		// These are the paths that are used when resolving sass imports

		sassIncludePaths: [
			path.dirname(require.resolve('bourbon')),
			...getClayPaths(),
			path.dirname(require.resolve('liferay-frontend-common-css')),
		],

		// Used in various places to keep intermediate artefacts out of Gradle's
		// way (see `buildSoy()`, `withTempFile()`, etc).

		temp: 'build/npmscripts',
	},
	check: CHECK_AND_FIX_GLOBS,
	fix: CHECK_AND_FIX_GLOBS,
	rules: {
		'allowed-named-scope-exceptions': [

			// A list of placeholder packages registered by Liferay. Anything
			// outside this list should be under the `@liferay/` named scope.

			'account-admin-web',
			'adaptive-media-image-js-web',
			'adaptive-media-web',
			'admin-dxp-theme',
			'analytics-client-js',
			'analytics-reports-web',
			'announcements-web',
			'app-builder-web',
			'app-builder-workflow-web',
			'asset-categories-admin-web',
			'asset-categories-item-selector-web',
			'asset-categories-selector-web',
			'asset-list-web',
			'asset-publisher-web',
			'asset-taglib',
			'asset-tags-admin-web',
			'blogs-web',
			'bookmarks-web',
			'calendar-web',
			'change-tracking-web',
			'classic-dxp-theme',
			'click-to-chat-web',
			'com-liferay-dynamic-data-mapping-test',
			'com-liferay-osb-loop-private',
			'com.liferay.osb.www.resources',
			'commerce-bom-admin-web',
			'commerce-bom-web',
			'commerce-cart-taglib',
			'commerce-dashboard-web',
			'commerce-frontend-impl',
			'commerce-frontend-js',
			'commerce-frontend-taglib',
			'commerce-organization-web',
			'commerce-product-content-web',
			'commerce-product-options-web',
			'commerce-theme-minium-impl',
			'contacts-web',
			'content-dashboard-web',
			'data-engine-js-components-web',
			'data-engine-rest-impl',
			'data-engine-taglib',
			'depot-web',
			'document-library-opener-onedrive-web',
			'document-library-preview-audio',
			'document-library-preview-document',
			'document-library-preview-image',
			'document-library-preview-video',
			'document-library-video',
			'document-library-web',
			'dxp-cloud-emulator',
			'dynamic-data-lists-web',
			'dynamic-data-mapping-data-provider-web',
			'dynamic-data-mapping-form-builder',
			'dynamic-data-mapping-form-field-type',
			'dynamic-data-mapping-form-renderer',
			'dynamic-data-mapping-form-report-web',
			'dynamic-data-mapping-form-web',
			'dynamic-data-mapping-web',
			'expando-web',
			'export-import-changeset-taglib',
			'exportimport-web',
			'flags-taglib',
			'forms-theme-contributor',
			'fragment-display-web',
			'fragment-renderer-collection-filter-impl',
			'fragment-renderer-react-impl',
			'fragment-resources',
			'fragment-web',
			'frontend-compatibility-ie',
			'frontend-editor-alloyeditor-web',
			'frontend-editor-ckeditor-web',
			'frontend-image-editor-capability-brightness',
			'frontend-image-editor-capability-contrast',
			'frontend-image-editor-capability-crop',
			'frontend-image-editor-capability-effects',
			'frontend-image-editor-capability-resize',
			'frontend-image-editor-capability-rotate',
			'frontend-image-editor-capability-saturation',
			'frontend-image-editor-web',
			'frontend-js-alert-support-web',
			'frontend-js-aui-web',
			'frontend-js-clay-sample-web',
			'frontend-js-collapse-support-web',
			'frontend-js-components-web',
			'frontend-js-dropdown-support-web',
			'frontend-js-jquery-web',
			'frontend-js-loader-modules-extender',
			'frontend-js-lodash-web',
			'frontend-js-metal-web',
			'frontend-js-node-shims',
			'frontend-js-react-web',
			'frontend-js-recharts',
			'frontend-js-spa-web',
			'frontend-js-svg4everybody-web',
			'frontend-js-tabs-support-web',
			'frontend-js-tooltip-support-web',
			'frontend-js-web',
			'frontend-taglib',
			'frontend-taglib-chart',
			'frontend-taglib-clay',
			'frontend-taglib-clay-sample-web',
			'frontend-taglib-clay-test-alert-toast-sample-web',
			'frontend-theme-classic-style-guide-sample-web',
			'frontend-theme-font-awesome-web',
			'headless-discovery-web',
			'hello-soy-navigation-web',
			'hello-soy-web',
			'hubspot-js',
			'invitation-invite-members-web',
			'item-selector-taglib',
			'item-selector-upload-web',
			'item-selector-url-web',
			'item-selector-web',
			'japan-theme',
			'journal-article-dynamic-data-mapping-form-field-type',
			'journal-web',
			'knowledge-base-web',
			'layout-admin-web',
			'layout-content-page-editor-web',
			'layout-dynamic-data-mapping-form-field-type',
			'layout-item-selector-web',
			'layout-reports-web',
			'layout-seo-web',
			'layout-set-prototype-web',
			'layout-taglib',
			'layout-template-admin-web',
			'lfris-www-components',
			'liferay-admin-theme',
			'liferay-classic-theme',
			'liferay-fjord-theme',
			'liferay-frontend-theme-styled',
			'liferay-frontend-theme-unstyled',
			'liferay-learn',
			'liferay-node-assert',
			'liferay-node-buffer',
			'liferay-node-console',
			'liferay-node-constants',
			'liferay-node-domain',
			'liferay-node-events',
			'liferay-node-os',
			'liferay-node-path',
			'liferay-node-process',
			'liferay-node-punycode',
			'liferay-node-querystring',
			'liferay-node-setimmediate',
			'liferay-node-string_decoder',
			'liferay-node-timers',
			'liferay-node-tty',
			'liferay-node-url',
			'liferay-node-util',
			'liferay-node-vm',
			'liferay-porygon-theme',
			'liferay-user-dashboard-theme',
			'liferay-user-profile-theme',
			'liferay-watson-web',
			'liferay-westeros-bank-theme',
			'map-google-maps',
			'map-openstreetmap',
			'marketing-fragments',
			'marketplace-store-web',
			'message-boards-web',
			'minium-theme',
			'multi-factor-authentication-fido2-web',
			'multi-factor-authentication-timebased-otp-web',
			'my-configurable-fragment',
			'my-sites-web',
			'my-subscriptions-web',
			'notifications-web',
			'oauth2-provider-web',
			'osb-commerce-portal-instance-admin-theme',
			'osb-commerce-provisioning-theme',
			'osb-commerce-provisioning-theme-impl',
			'osb-commerce-provisioning-web',
			'osb-community-doc-project-heading-web',
			'osb-community-doc-project-index-web',
			'osb-community-doc-project-random-nine-web',
			'osb-community-github-top-contributors-web',
			'osb-community-meetup-web',
			'osb-community-theme',
			'osb-customer-account-entry-details',
			'osb-customer-downloads-display',
			'osb-customer-release-tool',
			'osb-customer-theme',
			'osb-emulator',
			'osb-events-theme',
			'osb-faro-theme',
			'osb-faro-web',
			'osb-knowledge-base-theme',
			'osb-loop-theme',
			'osb-provisioning-theme',
			'osb-provisioning-web',
			'osb-www-foundations-theme-contributor',
			'osb-www-theme',
			'password-policies-admin-web',
			'polls-web',
			'portal-portlet-bridge-soy-impl',
			'portal-reports-engine-console-web',
			'portal-search-admin-web',
			'portal-search-ranking-web',
			'portal-search-synonyms-web',
			'portal-search-web',
			'portal-template-react-renderer-impl',
			'portal-workflow-kaleo-designer-web',
			'portal-workflow-kaleo-forms-web',
			'portal-workflow-metrics-web',
			'portal-workflow-task-web',
			'portal-workflow-web',
			'portlet-configuration-css-web',
			'portlet-configuration-web',
			'product-navigation-applications-menu',
			'product-navigation-control-menu',
			'product-navigation-control-menu-web',
			'product-navigation-simulation-device',
			'product-navigation-taglib',
			'questions-web',
			'ratings-taglib',
			'redirect-web',
			'remote-app-client-js',
			'remote-app-support-web',
			'roles-admin-web',
			'segments-experiment-web',
			'segments-simulation-web',
			'segments-web',
			'server-admin-web',
			'sharing-taglib',
			'sharing-web',
			'site-admin-web',
			'site-membership-web',
			'site-navigation-admin-web',
			'site-navigation-item-selector-web',
			'site-navigation-menu-item-layout',
			'site-navigation-menu-web',
			'site-teams-web',
			'social-bookmarks-taglib',
			'speedwell-theme',
			'staging-bar-web',
			'staging-processes-web',
			'staging-taglib',
			'style-book-web',
			'testray-theme',
			'theme-contributor',
			'translation-web',
			'trash-web',
			'user-associated-data-web',
			'user-dashboard-dxp-theme',
			'user-groups-admin-web',
			'user-profile-dxp-theme',
			'users-admin-web',
			'watson-theme',
			'wiki-web',
			'youtube-web',
		],
		'blacklisted-dependency-patterns': [
			'^@testing-library/',
			'^liferay-npm-bundler-loader-.+',
			'^react-test-renderer$',
		],
	},
	storybook: {
		languagePaths: ['src/main/resources/content/Language.properties'],
		port: '9000',
		portalURL: 'http://0.0.0.0:8080',
	},
};
