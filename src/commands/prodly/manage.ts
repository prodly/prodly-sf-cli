import { Messages, SfError } from '@salesforce/core';
import { Flags, SfCommand } from '@salesforce/sf-plugins-core';
import { createConnection, queryConnection, queryConnections } from '../../services/connections.js';
import {
  getManagedInstance,
  getManagedInstances,
  manageInstanceAsync,
  unmanageInstance,
} from '../../services/manage-instances.js';
import { JSONObject } from '../../types/generic.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const commandMessages = Messages.loadMessages('prodlysfcli', 'prodly.manage');
const prodlyMessages = Messages.loadMessages('prodlysfcli', 'prodly');

export type ProdlyManageResult = {
  path: string;
};

export default class ProdlyManage extends SfCommand<JSONObject> {
  public static readonly summary = commandMessages.getMessage('summary');
  public static readonly description = prodlyMessages.getMessage('commandDescription');
  public static readonly examples = commandMessages.getMessages('examples');

  public static readonly flags = {
    'target-dev-hub': Flags.requiredHub(),
    'target-org': Flags.requiredOrg(),
    comment: Flags.string({ char: 'c', summary: prodlyMessages.getMessage('commentFlagDescription') }),
    connection: Flags.string({ char: 'n', summary: prodlyMessages.getMessage('connectionFlagDescription') }),
    instance: Flags.string({ char: 'i', summary: prodlyMessages.getMessage('instanceFlagDescription') }),
    label: Flags.string({ char: 'b', summary: prodlyMessages.getMessage('instanceNameFlagDescription') }),
    list: Flags.boolean({ char: 'l', summary: prodlyMessages.getMessage('listFlagDescription') }),
    manage: Flags.boolean({ char: 'm', summary: prodlyMessages.getMessage('manageFlagDescription') }),
    print: Flags.boolean({ char: 'p', summary: prodlyMessages.getMessage('printFlagDescription') }),
    unmanage: Flags.boolean({ char: 'x', summary: prodlyMessages.getMessage('unmanageFlagDescription') }),
    version: Flags.boolean({ char: 's', summary: prodlyMessages.getMessage('versionFlagDescription') }),
  };

  // eslint-disable-next-line complexity
  public async run(): Promise<JSONObject> {
    const { flags } = await this.parse(ProdlyManage);

    const {
      comment: commentFlag,
      connection: connectionFlag,
      instance: instanceFlag,
      label: labelFlag,
      list: listFlag,
      manage: manageFlag,
      print: printFlag,
      unmanage: unmanageFlag,
      version: versionFlag,
    } = flags;

    this.log('List flag: ' + listFlag);
    this.log('Print flag: ' + printFlag);
    this.log('Manage flag: ' + manageFlag);
    this.log('Instance flag: ' + instanceFlag);
    this.log('Instance name flag: ' + labelFlag);
    this.log('Unmanage flag: ' + unmanageFlag);
    this.log('Version flag: ' + versionFlag);
    this.log('Comment flag: ' + commentFlag);
    this.log('Connection flag: ' + connectionFlag);

    if (!listFlag && !manageFlag && !unmanageFlag) {
      throw new SfError(prodlyMessages.getMessage('errorNoManageFlags', []));
    }

    if (listFlag && manageFlag) {
      throw new SfError(prodlyMessages.getMessage('errorMultipleManageFlags', []));
    }

    if (manageFlag && !labelFlag) {
      throw new SfError(prodlyMessages.getMessage('errorManageLabelFlag', []));
    }

    if (!listFlag && printFlag) {
      throw new SfError(prodlyMessages.getMessage('errorPrintFlagNoListFlag', []));
    }

    if (!manageFlag && versionFlag) {
      throw new SfError(prodlyMessages.getMessage('errorVersionFlagNoManageFlag', []));
    }

    const org = flags['target-org'];
    const hubOrg = flags['target-dev-hub'];
    const hubConn = hubOrg.getConnection();
    const print = (message: string | undefined, ...args: unknown[]): void => this.log(message, ...args);

    if (listFlag) {
      this.log('Listing managed instances.');
      const managedInstances = await getManagedInstances({ hubConn, print });
      const connectionIds = managedInstances.instances
        .map((instance) => instance.connectionId)
        .filter((connectionId) => connectionId);

      const connections = await queryConnections({ connectionIds, hubConn, print });

      managedInstances.instances.forEach((instance) => {
        const connection = instance.connectionId ? connections.get(instance.connectionId) : null;
        const connectionName = connection ? connection.Name : '';
        const instanceUrl = connection ? connection.PDRI__Instance_URL__c : '';

        instance.instanceName = connectionName;
        instance.instanceUrl = instanceUrl;
      });

      if (printFlag) {
        this.log('Printing managed instances.\n');

        managedInstances.instances.forEach((instance) => {
          const connection = instance.connectionId ? connections.get(instance.connectionId) : null;
          const connectionName = connection ? connection.Name : '';
          const instanceUrl = connection ? connection.PDRI__Instance_URL__c : '';

          this.log('Managed Instance');
          this.log(`Instance ID: ${instance.id}`);
          this.log(`Instance Name: ${connectionName}`);
          this.log(`Control Instance: ${instance.controlInstance}`);
          this.log(`Salesforce Org ID: ${instance.platformInstanceId}`);
          this.log(`Connection Record ID: ${instance.connectionId}`);
          this.log(`Instance Type ${instance.instanceType}`);
          this.log(`Instance URL ${instanceUrl}\n`);
        });
      }

      return managedInstances as unknown as JSONObject;
    }

    if (manageFlag) {
      this.log('Managing instance.');
      this.log('Refreshing org session auth');
      await org.refreshAuth();
      let connectionId = null;

      if (connectionFlag) {
        this.log('Connection to use for the managed instances provided: ' + connectionFlag);
        const connection = await queryConnection({ connectionNameOrId: connectionFlag, hubConn, print });
        connectionId = connection.Id;
      } else {
        this.log('Creating connection.');
        connectionId = await createConnection({ name: labelFlag, org, hubConn });
        this.log('Created connection with record ID: ', connectionId);
      }

      const orgId = org.getOrgId();
      const body: {
        [key: string]: { [key: string]: unknown };
      } = {
        platformInstance: {
          platformInstanceId: orgId,
          connectionId,
          instanceName: labelFlag,
        },
      };
      if (versionFlag) {
        if (print) print('Versioning is enabled.');
        body.options = { checkin: true, checkout: true };
        if (commentFlag) body.options.commitMessage = commentFlag;
      } else {
        body.options = { checkin: false, checkout: false, environmentExists: false };
      }

      this.log(`Managing instance for org ID: ${orgId}`);
      this.log('Manage instance body:');
      this.log(JSON.stringify(body));

      const jobId = await manageInstanceAsync({ body, hubConn, print });

      this.log(`Manage Instance launched with Job ID: ${jobId}`);
      return { jobId, message: 'Manage Instance launched' };
    }

    if (unmanageFlag) {
      this.log('Unmanaging instance.');

      let mangedInstanceId = '';

      if (instanceFlag) {
        // Use provided managed instance
        this.log(`Managed instance ID provided, using instance with id ${instanceFlag}`);
        mangedInstanceId = instanceFlag;
      } else if (connectionFlag) {
        this.log(`Connection to use for the managed instances provided: ${connectionFlag}`);
        const connection = await queryConnection({ connectionNameOrId: connectionFlag, hubConn, print });
        const orgId = connection.PDRI__OrganizationId__c;

        // Retrieve the managed instance associated with target org
        // DevHub control org is never used as the default
        const managedInstance = await getManagedInstance({ hubConn, orgId, print });
        if (!managedInstance) {
          throw new SfError(prodlyMessages.getMessage('errorManagedInstaceNotFound'));
        }
        mangedInstanceId = managedInstance.id;
      } else {
        throw new SfError(prodlyMessages.getMessage('errorManagedInstaceNotProvided'));
      }

      const readline = await import('node:readline/promises');
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: '>' });
      const answer = await rl.question(prodlyMessages.getMessage('unmanageInstancePrompt'));
      rl.close();

      if (answer.trim() === mangedInstanceId) {
        await unmanageInstance({ instanceId: mangedInstanceId, hubConn, print });
        this.log(`Successfully Unmanaged Instance with Id: ${mangedInstanceId}`);
        return { message: `Successfully Unmanaged Instance with Id: ${mangedInstanceId}` };
      }
      this.log(`Unmanage Instance with Id ${mangedInstanceId} aborted`);
      return { message: `Unmanage Instance with Id ${mangedInstanceId} aborted` };
    }

    return {};
  }
}
