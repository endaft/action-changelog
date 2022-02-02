export const DEFAULT_CONFIG: ChangelogConfig = {
  types: [
    { types: ['feat', 'feature'], label: 'New Features' },
    { types: ['fix', 'bugfix'], label: 'Bugfixes' },
    { types: ['improvements', 'enhancement'], label: 'Improvements' },
    { types: ['perf'], label: 'Performance Improvements' },
    { types: ['build', 'ci'], label: 'Build System' },
    { types: ['refactor'], label: 'Refactors' },
    { types: ['doc', 'docs'], label: 'Documentation Changes' },
    { types: ['test', 'tests'], label: 'Tests' },
    { types: ['style'], label: 'Code Style Changes' },
    { types: ['chore'], label: 'Chores' },
    { types: ['other'], label: 'Other Changes' },
  ],

  excludeTypes: [],

  renderTypeSection: (label, commits) => {
    return `\n## ${label}\n${commits
      .map((c) => {
        return `- ${c.scope ? `**${c.scope}:** ` : ''}${c.subject}`;
      })
      .join('\n')}\n`;
  },

  renderNotes: (notes) => {
    return `\n## BREAKING CHANGES\n${notes.map((n) => {
      return `- due to [${n.commit.sha.substring(0, 6)}](${n.commit.url}): ${n.commit.subject}\n\n${n.text}\n\n`;
    }).join('')}`;
  },

  renderChangelog: (release, changes) => {
    return `# ${release} - ${new Date().toISOString().substring(0, 10)}\n\n` + changes + '\n\n';
  },
};
