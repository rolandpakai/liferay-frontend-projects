/**
 * SPDX-FileCopyrightText: © 2020 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: MIT
 */

const JiraClient = require('../jira/JiraClient');
const {addGithubIssueToBody} = require('../jira/github-jira-mapping');

module.exports = {
	canHandleEvent(name, payload) {
		return name === 'issues' && payload.action === 'opened';
	},

	handleEvent({issue}) {
		const jiraClient = new JiraClient();

		return jiraClient.createIssue({
			description: addGithubIssueToBody(issue.html_url, issue.body),
			title: issue.title,
		});
	},
};
