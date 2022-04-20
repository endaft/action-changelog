# action-changelog

A GitHub Action triggered by a new (valid semver) tag getting pushed. It then fetches all the commits since the previous tag and creates a changelog text using the [Conventional Commits](https://www.conventionalcommits.org) format. It will also turn PR numbers into clickable links mentioning the author.

This Action returns the generated changelog text but doesn't do anything more; you need to prepend it to a `CHANGELOG.md` file, create a GitHub Release with this text, etc.

## Example workflow

```yml
name: Create Release

on:
  push:
    tags:
      - '*'

jobs:
  create-release:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Create changelog text
        id: changelog
        uses: endaft/action-changelog@v0.0.3
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          exclude_types: other,doc,chore

      - name: Create release
        uses: actions/create-release@latest
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: ${{ steps.changelog.outputs.changes }}
```

## Inputs

| name | required | description | default |
| --- | --- | --- | --- |
| **token** | `true` | Your GitHub token, `${{ secrets.GITHUB_TOKEN }}`. |  |
| **exclude_types** | `true` | A comma-separated list of commit types you want to exclude from the changelog, for example: "other,chore". This is also configurable in the config file. |  |
| **config_file** | `true` | Location of the config file. |  |

## Outputs

| name | description |
| --- | --- |
| `changelog` | Generated changelog for the latest tag, including the version/date header (suitable for pre-pending to a `CHANGELOG.md` file). |
| `changes` | Generated changelog for the latest tag, without the version/date header (suitable for GitHub Releases). |

## Custom config

```yml
- name: Create changelog text
  uses: endaft/action-changelog@v0.0.3
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    config_file: .github/changelog-config.js
```

You can use a config file to map commit-types to changelog labels, override the rendering of changelog sections, or the overall changelog. You only need to override the things you want to override. For example, you can leave out `renderNotes`, `renderTypeSection` and `renderChangelog` and only include the `types` config; whatever you don't override will use the default.

### Example config file:

The order in which the `types` appear also determines the order of the generated sections in the changelog. The method implementations shown here are the defaults.

```javascript
module.exports = {
  types: [
    { types: ['feat', 'feature'], label: '🎉 New Features' },
    { types: ['fix', 'bugfix'], label: '🐛 Bugfixes' },
    { types: ['improvements', 'enhancement'], label: '🔨 Improvements' },
    { types: ['perf'], label: '🏎️ Performance Improvements' },
    { types: ['build', 'ci'], label: '🏗️ Build System' },
    { types: ['refactor'], label: '🪚 Refactors' },
    { types: ['doc', 'docs'], label: '📚 Documentation Changes' },
    { types: ['test', 'tests'], label: '🔍 Tests' },
    { types: ['style'], label: '💅 Code Style Changes' },
    { types: ['chore'], label: '🧹 Chores' },
    { types: ['other'], label: 'Other Changes' },
  ],

  excludeTypes: ['other'],

  /**
   * If implemented, performs note rendering.
   * @param {ChangelogCommitNote} notes An array of {@link ChangelogCommitNote}
   * @returns A `string` of the rendered notes.
   */
  renderNotes: (notes) => {
    return `\n## BREAKING CHANGES\n${notes
      .map((n) => {
        return `- due to [${n.commit.sha.substring(0, 6)}](${n.commit.url}): ${n.commit.subject}\n\n${n.text}\n\n`;
      })
      .join('')}`;
  },

  /**
   * If implemented, performs changelog type section rendering.
   * @param {string} label A label from the {@link ChangelogConfig.types config types}
   * @param {ChangelogCommit[]} commits An array of {@link ChangelogCommit changelog commits} which are responsive to the `label`.
   */
  renderTypeSection: (label, commits) => {
    return `\n## ${label}\n${commits
      .map((c) => {
        return `- ${c.scope ? `**${c.scope}:** ` : ''}${c.subject}`;
      })
      .join('\n')}\n`;
  },

  /**
   * If implemented, performs changelog rendering.
   * @param {string} release The tag name for the release. Ex: `v1.0.0`
   * @param {string} changes The formatted changes text from accumulating all {@link ChangelogConfig.renderTypeSection renderTypeSection} calls
   * @returns A `string` of the formatted, final changelog. There is no further processing after this call.
   */
  renderChangelog: (release, changes) => {
    return `# ${release} - ${new Date().toISOString().substring(0, 10)}\n\n` + changes + '\n\n';
  },
};
```

## Example output

> # v0.14.0 - 2021-02-22
>
> ## New Features
>
> - merge the default config with the user config so that the user config only has to override values it wants and use the defaults for the others
> - the custom config file is now JS instead of JSON, allow the override of the changelog text templates ([#2](https://github.com/loopwerk/tag-changelog/pull/2) by [kevinrenskers](https://github.com/kevinrenskers))
> - commit types to exclude can now also be configured via the config file
>
> ## Documentation Changes
>
> - simplified readme
>
> ## Chores
>
> - added project logo
>
> ## BREAKING CHANGES
>
> - due to [bcb876](https://github.com/loopwerk/tag-changelog/commit/bcb8767bc22bc7d4ab47a4fffd4ef435de581054): commit types to exclude can now also be configured via the config file
>
>   The `exclude` input parameter has been renamed to `exclude_types`.

## Thanks

Thanks to [loopwerk/tag-changelog](https://github.com/loopwerk/tag-changelog), the original creator of this action.
