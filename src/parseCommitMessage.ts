import { parser, toConventionalChangelogFormat } from '@conventional-commits/parser';

const PR_REGEX = /#([1-9]\d*)/;

export async function parseCommitMessage(
  message: string,
  repoUrl?: string,
  fetchUserFunc?: FetchUserFunc
): Promise<ChangelogCommit> {
  let cAst: ChangelogCommit;

  try {
    const ast = parser(message);
    cAst = toConventionalChangelogFormat(ast);
  } catch (error) {
    // Not a valid commit
    cAst = {
      subject: message.split('\n')[0],
      type: 'other',
    };
  }

  const found = cAst.subject.match(PR_REGEX);
  if (found) {
    const pullNumber = found[1];

    try {
      const { username, userUrl } = await fetchUserFunc(pullNumber);
      cAst.subject = cAst.subject.replace(
        PR_REGEX,
        () => `[#${pullNumber}](${repoUrl}/pull/${pullNumber}) by [${username}](${userUrl})`
      );
    } catch (error) {
      // We found a #123 style hash, but it wasn't a valid PR. Ignore.
    }
  }

  return cAst;
}
