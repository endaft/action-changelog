import { parseCommitMessage } from '../src/parseCommitMessage';

const fetchUserFunc = async (pr: string) =>
  Promise.resolve({
    username: 'endaft',
    userUrl: 'https://github.com/endaft',
  });

describe('Test parseCommitMessage', () => {
  it('Parses A Basic feat As Expected', async () => {
    const result = await parseCommitMessage('feat: This is a feature');

    expect(result.type).toStrictEqual('feat');
    expect(result.subject).toStrictEqual('This is a feature');
  });

  it('Parses A Basic feat With Multiple Lines', async () => {
    const result = await parseCommitMessage('feat: This is a feature\n\nBody');

    expect(result.type).toStrictEqual('feat');
    expect(result.subject).toStrictEqual('This is a feature');
  });

  it('Parses A Basic feat With A PR Number', async () => {
    const result = await parseCommitMessage(
      'feat: This is a feature [#1]',
      'https://github.com/endaft/action-changelog',
      fetchUserFunc
    );

    expect(result.type).toStrictEqual('feat');
    expect(result.subject).toStrictEqual(
      'This is a feature [[#1](https://github.com/endaft/action-changelog/pull/1) by [endaft](https://github.com/endaft)]'
    );
  });

  it('Parses A Basic fix', async () => {
    const result = await parseCommitMessage('fix: This is a fix');

    expect(result.type).toStrictEqual('fix');
    expect(result.subject).toStrictEqual('This is a fix');
  });

  it('Parse A Breaking Change fix', async () => {
    const result = await parseCommitMessage('fix!: This is a fix');

    expect(result.type).toStrictEqual('fix');
    expect(result.subject).toStrictEqual('This is a fix');
    expect(result.notes).toStrictEqual([{ text: 'This is a fix', title: 'BREAKING CHANGE' }]);
  });

  it('Parses A Missing Type', async () => {
    const result = await parseCommitMessage('This is a commit');

    expect(result.type).toStrictEqual('other');
    expect(result.subject).toStrictEqual('This is a commit');
  });

  it('Parses A Missing Type With Multiple Lines', async () => {
    const result = await parseCommitMessage('This is a commit\n\nBody');

    expect(result.type).toStrictEqual('other');
    expect(result.subject).toStrictEqual('This is a commit');
  });

  it('Parse A Missing Type With A PR Number', async () => {
    const result = await parseCommitMessage(
      'This is a commit [#1]',
      'https://github.com/endaft/action-changelog',
      fetchUserFunc
    );

    expect(result.type).toStrictEqual('other');
    expect(result.subject).toStrictEqual(
      'This is a commit [[#1](https://github.com/endaft/action-changelog/pull/1) by [endaft](https://github.com/endaft)]'
    );
  });

  it('Parse A Scope', async () => {
    const result = await parseCommitMessage('fix(scope): This is a fix');

    expect(result.type).toStrictEqual('fix');
    expect(result.scope).toStrictEqual('scope');
    expect(result.subject).toStrictEqual('This is a fix');
  });

  it('Parse A Malformed Scope', async () => {
    const result = await parseCommitMessage('fix (scope): This is a fix');

    expect(result.type).toStrictEqual('other');
    expect(result.scope).toStrictEqual(undefined);
    expect(result.subject).toStrictEqual('fix (scope): This is a fix');
  });
});
