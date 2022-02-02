import compareVersions from 'compare-versions';

export function sortAndValidate(tags: GitHubTag[]): GitHubTag[] {
  return tags
    .filter((t) => compareVersions.validate(t.name))
    .sort((a, b) => {
      return compareVersions(a.name, b.name);
    })
    .reverse();
}
