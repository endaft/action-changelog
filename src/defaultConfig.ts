export const DEFAULT_CONFIG: ChangelogConfig = {
  types: [
    { label: '🎉 New Features', types: ['feat', 'feature'] },
    { label: '🐛 Bugfixes', types: ['fix', 'bugfix', 'bug'] },
    { label: '🔨 Improvements', types: ['improvements', 'enhancement', 'impro', 'enhance'] },
    { label: '🚀 Performance Improvements', types: ['perf'] },
    { label: '📚 Documentation Changes', types: ['doc', 'docs'] },
    { label: '🧪 Quality', types: ['test', 'tests', 'quality'] },
    { label: '🧱 Build System', types: ['build', 'ci', 'cd', 'workflow', 'cicd'] },
    { label: '🪚 Refactors', types: ['refactor', 'refac', 'refact', 'ref'] },
    { label: '💅 Code Style Changes', types: ['style', 'format'] },
    { label: '🧹 Chores', types: ['chore'] },
    { label: '🤔 Other Changes', types: ['other'] },
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
    return `\n## BREAKING CHANGES\n${notes
      .map((n) => {
        return `- due to [${n.commit.sha.substring(0, 6)}](${n.commit.url}): ${n.commit.subject}\n\n${n.text}\n\n`;
      })
      .join('')}`;
  },

  renderChangelog: (release, changes) => {
    return `# ${release} - ${new Date().toISOString().substring(0, 10)}\n\n` + changes + '\n\n';
  },
};
