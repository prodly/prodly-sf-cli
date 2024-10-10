import { Messages, SfError } from '@salesforce/core';
import { Flags, SfCommand } from '@salesforce/sf-plugins-core';
import {
  getManagedInstance,
  getManagedInstances,
  postInstances,
  putInstances,
} from '../../services/manage-instances.js';
import { JSONObject } from '../../types/generic.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('prodlysfcli', 'prodly.version');
const prodlyMessages = Messages.loadMessages('prodlysfcli', 'prodly');

export default class ProdlyVersion extends SfCommand<JSONObject> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = prodlyMessages.getMessage('descriptionVersionCommand');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    'new-branch': Flags.string({
      summary: prodlyMessages.getMessage('newBranchFlagSummary'),
      char: 'b',
      required: false,
    }),
    'source-branch': Flags.string({
      summary: prodlyMessages.getMessage('sourceBranchFlagSummary'),
      char: 's',
      required: false,
    }),
    'target-dev-hub': Flags.requiredHub(),
    'target-org': Flags.requiredOrg(),
    instance: Flags.string({
      summary: prodlyMessages.getMessage('instanceFlagDescription'),
      char: 'i',
      required: false,
    }),
    unlink: Flags.boolean({ char: 'x', summary: prodlyMessages.getMessage('unlinkBranchFlagDescription') }),
  };

  public async run(): Promise<JSONObject> {
    const { flags } = await this.parse(ProdlyVersion);

    const org = flags['target-org'];
    const hubOrg = flags['target-dev-hub'];
    const hubConn = hubOrg.getConnection();
    const print = (message: string | undefined, ...args: unknown[]): void => this.log(message, ...args);

    const { instance, unlink } = flags;

    if (!unlink && !flags['source-branch']) {
      throw new SfError('Flag source-branch is required to version control managed environment');
    }

    let managedInstance;
    // Check if managed instance Id is provided else get the managed instance from the target org
    if (instance) {
      print(`Managed instance ID provided, using instance with id ${instance}`);
      const managedInstances = await getManagedInstances({ hubConn });
      managedInstance = managedInstances.instances.find((inst) => inst.id === instance);
    } else {
      print('Managed instance ID not provided, using the target org');
      const orgId = org.getOrgId();
      managedInstance = await getManagedInstance({ hubConn, orgId, print });
    }
    if (!managedInstance) {
      throw new SfError(prodlyMessages.getMessage('errorManagedInstaceNotFound'));
    }

    if (unlink) {
      await putInstances({
        hubConn,
        body: {
          options: { checkin: false, checkout: false, commitMessage: '', environmentExists: true },
          platformInstance: {
            branchName: null,
            connectionId: managedInstance.connectionId,
            platformInstanceId: managedInstance.platformInstanceId,
            sourceBranchName: null,
          },
        },
      });

      print('Version control managed environment unlinked');
      return {};
    }

    const { jobId } = await postInstances({
      hubConn,
      body: {
        options: { checkin: true, checkout: true, commitMessage: '', environmentExists: true },
        platformInstance: {
          branchName: flags['new-branch'],
          connectionId: managedInstance.connectionId,
          platformInstanceId: managedInstance.platformInstanceId,
          sourceBranchName: flags['source-branch'],
        },
      },
    });

    print(`Version control managed environment launched with Job ID: ${jobId}`);
    return { jobId };
  }
}
