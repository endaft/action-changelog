type ChangelogUser = { username: string; userUrl: string };

type ChangelogAuthor = { name?: string; email?: string };

type FetchUserFunc = (pr: string) => Promise<ChangelogUser>;

type ChangelogResult = { changelog: string; changes: string };

type ChangelogLabelMap = { types: string[]; label: string };

type ChangelogCommitGroup = { type: string; commits: ChangelogCommit[] };

type ChangelogCommitNote = { title: string; text: string; commit?: ChangelogCommit };

type GitHubTag = { name: string; commit: { sha: string; url: string } };

type ChangelogCommit = {
  subject: string;
  type: string;
  sha?: string;
  url?: string;
  scope?: string;
  author?: ChangelogAuthor;
  notes?: ChangelogCommitNote[];
};

type ChangelogConfig = {
  types: ChangelogLabelMap[];
  excludeTypes: string[];
  /**
   * If implemented, performs note rendering.
   * @param {ChangelogCommitNote} notes An array of {@link ChangelogCommitNote}
   * @returns A `string` of the rendered notes.
   */
  renderNotes: (notes: ChangelogCommitNote[]) => string;
  /**
   * If implemented, performs changelog rendering.
   * @param {string} release The tag name for the release. Ex: `v1.0.0`
   * @param {string} changes The formatted changes text from accumulating all {@link ChangelogConfig.renderTypeSection renderTypeSection} calls
   * @returns A `string` of the formatted, final changelog. There is no further processing after this call.
   */
  renderChangelog: (release: string, changes: string) => string;
  /**
   * If implemented, performs changelog type section rendering.
   * @param {string} label A label from the {@link ChangelogConfig.types config types}
   * @param {ChangelogCommit[]} commits An array of {@link ChangelogCommit changelog commits} which are responsive to the `label`.
   */
  renderTypeSection: (label: string, commits: ChangelogCommit[]) => string;
};
