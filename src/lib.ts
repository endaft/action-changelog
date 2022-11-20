import * as core from '@actions/core';
import * as github from '@actions/github';
import compareVersions from 'compare-versions';

import { DEFAULT_CONFIG } from './defaultConfig';
import { sortAndValidate } from './sortAndValidateTags';
import { generateChangelog } from './generateChangelog';
import { parseCommitMessage } from './parseCommitMessage';

const {
  repo: { owner, repo },
} = github.context;

function getConfig(path: string): ChangelogConfig {
  if (path) {
    let workspace = process.env.GITHUB_WORKSPACE;
    if (process.env.ACT) {
      // Otherwise testing this in ACT doesn't work
      workspace += '/action-changelog';
    }

    const userConfig: ChangelogConfig = require(`${workspace}/${path}`);

    // Merge default config with user config
    return Object.assign({}, DEFAULT_CONFIG, userConfig);
  }

  return DEFAULT_CONFIG;
}

export async function handleAction(): Promise<void> {
  const token = core.getInput('token', { required: true });
  const octokit = github.getOctokit(token);

  const configFile = core.getInput('config_file', { required: false });
  const config = getConfig(configFile);
  const excludeTypesString = core.getInput('exclude_types', { required: false }) || '';

  if (excludeTypesString) {
    config.excludeTypes = excludeTypesString.split(',');
  }

  // Find the two most recent tags
  const { data: tags } = await octokit.rest.repos.listTags({
    owner,
    repo,
    per_page: 10,
  });

  const validSortedTags = sortAndValidate(tags);

  if (validSortedTags.length < 2) {
    core.setFailed('No previous tag found');
    return;
  }

  // Find the commits between two tags
  const result = await octokit.rest.repos.compareCommits({
    owner,
    repo,
    base: validSortedTags[1].commit.sha,
    head: validSortedTags[0].commit.sha,
  });

  const fetchUserFunc = async function (pullNumber) {
    const pr = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
    });

    return {
      username: pr.data.user.login,
      userUrl: pr.data.user.html_url,
    };
  };

  // Parse every commit, getting the type, turning PR numbers into links, etc
  const commitObjects = (
    await Promise.all(
      result.data.commits.map(async (commit) => {
        const commitObj = await parseCommitMessage(
          commit.commit.message,
          `https://github.com/${owner}/${repo}`,
          fetchUserFunc
        );
        commitObj.sha = commit.sha;
        commitObj.url = commit.html_url;
        commitObj.author = commit.author;
        return commitObj;
      })
    )
  ).filter((m) => !!m);

  // And generate the changelog
  if (commitObjects.length === 0) {
    core.info(`No changes between '${validSortedTags[0].name}' and '${validSortedTags[1].name}'. Outputs will be empty.`);
    core.setOutput('changelog', '');
    core.setOutput('changes', '');
    return;
  }

  const log = generateChangelog(validSortedTags[0].name, commitObjects, config);

  core.info(log.changelog);
  core.setOutput('changelog', log.changelog);
  core.setOutput('changes', log.changes);
}
