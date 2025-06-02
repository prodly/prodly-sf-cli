import { Messages, SfError } from '@salesforce/core';
import { Flags, SfCommand } from '@salesforce/sf-plugins-core';
import { getVCSRepoFolders } from '../../services/configuration-management.js';
import { JSONObject } from '../../types/generic.js';
import { VCSRepoFolder } from '../../types/prodly.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const commandMessages = Messages.loadMessages('prodlysfcli', 'prodly.branch-folders');
const prodlyMessages = Messages.loadMessages('prodlysfcli', 'prodly');

export type ProdlyBranchFoldersResult = {
  path: string;
};

export default class ProdlyBranchFolders extends SfCommand<JSONObject> {
  public static readonly summary = commandMessages.getMessage('summary');
  public static readonly description = prodlyMessages.getMessage('descriptionBranchFoldersCommand');
  public static readonly examples = commandMessages.getMessages('examples');

  public static readonly flags = {
    'api-version': Flags.orgApiVersion(),
    'target-dev-hub': Flags.requiredHub(),
    list: Flags.boolean({
      char: 'l',
      required: true,
      summary: prodlyMessages.getMessage('listBranchFoldersFlagDescription'),
    }),
  };

  public async run(): Promise<JSONObject> {
    const { flags } = await this.parse(ProdlyBranchFolders);

    const hubOrg = flags['target-dev-hub'];
    const hubConn = hubOrg.getConnection(flags['api-version']);

    const vcsRepoFolders = await getVCSRepoFolders({ hubConn });
    if (!vcsRepoFolders) throw new SfError('No branch folders found');
    vcsRepoFolders.forEach((vcsRepoFolder) => this.logVCSRepoFolder(vcsRepoFolder));
    return vcsRepoFolders;
  }

  private logVCSRepoFolder(vcsRepoFolder: VCSRepoFolder): void {
    this.log(
      'ID:',
      vcsRepoFolder.id + `${vcsRepoFolder.isDefault ? ` (default ${vcsRepoFolder.folderType} folder)` : ''}`
    );
    this.log('Folder Path:', vcsRepoFolder.folderPath);
    this.log('Folder Type:', vcsRepoFolder.folderType + '\n');
  }
}
