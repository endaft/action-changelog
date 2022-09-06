import { compareVersions, validate } from 'compare-versions';

export function sortAndValidate(tags: GitHubTag[]): GitHubTag[] {
  return tags
    .filter((t) => validate(t.name))
    .sort((a, b) => {
      return compareVersions(a.name, b.name);
    })
    .reverse();
}
