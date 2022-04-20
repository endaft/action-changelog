import compareVersions from 'compare-versions';
import { randomInt, randomUUID } from 'crypto';
import { sortAndValidate } from '../src/sortAndValidateTags';

function makeShas(count: number): string[] {
  return Array(count)
    .fill(0)
    .map(() => randomUUID().replaceAll('-', ''));
}

describe('Test sortAndValidate', () => {
  it('Sorts And Validates Basic SemVer Tags', () => {
    const shas = makeShas(9);
    const tagsRaw: GitHubTag[] = Array(9)
      .fill(0)
      .map(
        (_, i) =>
          ({
            name: `v${randomInt(9)}.${randomInt(127)}.${randomInt(255)}`,
            commit: { sha: shas[i], url: `http://github.com/endaft/action-changelog/pull/${i + 1 * randomInt(999)}` },
          } as GitHubTag)
      );
    const tags = sortAndValidate(tagsRaw);
    for (var i = 1; i < tags.length; i++) {
      const diff = compareVersions(tags[i].name, tags[i - 1].name);
      expect(diff).toBeLessThanOrEqual(0);
    }
  });

  function yesOrNo() {
    return Math.round(randomInt(10) / 10) === 1;
  }

  it('Sorts And Validates Basic + Prerelease SemVer Tags', () => {
    const shas = makeShas(9);
    const tagsRaw: GitHubTag[] = Array(9)
      .fill(0)
      .map(
        (_, i) =>
          ({
            name: `v${randomInt(9)}.${randomInt(127)}.${randomInt(255)}${yesOrNo() ? `-dev.${randomInt(255)}` : ''}`,
            commit: { sha: shas[i], url: `http://github.com/endaft/action-changelog/pull/${i + 1 * randomInt(999)}` },
          } as GitHubTag)
      );
    const tags = sortAndValidate(tagsRaw);
    for (var i = 1; i < tags.length; i++) {
      const diff = compareVersions(tags[i].name, tags[i - 1].name);
      expect(diff).toBeLessThanOrEqual(0);
    }
  });
});
