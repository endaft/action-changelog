export const DEFAULT_CONFIG: ChangelogConfig = {
  types: [
    { label: '๐ New Features', types: ['feat', 'feature'] },
    { label: '๐ Bugfixes', types: ['fix', 'bugfix', 'bug'] },
    { label: '๐จ Improvements', types: ['improvements', 'enhancement', 'impro', 'enhance'] },
    { label: '๐ Performance Improvements', types: ['perf'] },
    { label: '๐ Documentation Changes', types: ['doc', 'docs'] },
    { label: '๐งช Quality', types: ['test', 'tests', 'quality'] },
    { label: '๐งฑ Build System', types: ['build', 'ci', 'cd', 'workflow', 'cicd'] },
    { label: '๐ช Refactors', types: ['refactor', 'refac', 'refact', 'ref'] },
    { label: '๐ Code Style Changes', types: ['style', 'format'] },
    { label: '๐งน Chores', types: ['chore'] },
    { label: '๐ค Other Changes', types: ['other'] },
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
