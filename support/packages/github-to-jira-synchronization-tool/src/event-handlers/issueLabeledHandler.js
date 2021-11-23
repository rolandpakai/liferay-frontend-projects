/**
 * SPDX-FileCopyrightText: © 2020 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: MIT
 */

const {getLabelMapping} = require('../config/config');
const JiraClient = require('../jira/JiraClient');

module.exports = {
	canHandleEvent(name, payload) {
		return (
			name === 'issues' &&
			(payload.action === 'labeled' || payload.action === 'unlabeled')
		);
	},

	async handleEvent({issue}) {
		const jiraClient = new JiraClient();

		const jiraIssue = await jiraClient.searchIssueWithGithubIssueId({
			githubIssueId: issue.html_url,
		});

		const [firstLabel = {}] = issue.labels;

		const type = getLabelMapping(firstLabel.name);

		return jiraClient.updateIssue({issueId: jiraIssue.key, type});
	},
};
