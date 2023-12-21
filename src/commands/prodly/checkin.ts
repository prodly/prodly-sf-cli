import { Connection, Messages, SfError } from '@salesforce/core';
import { Flags, SfCommand } from '@salesforce/sf-plugins-core';
import { AnyJson } from '@salesforce/ts-types';
import { updateConnection } from '../../services/connections.js';
import { getManagedInstance } from '../../services/instances.js';
import { getDeploymentEntityId } from '../../services/queries.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const commandMessages = Messages.loadMessages('prodlysfcli', 'prodly.checkin');
const prodlyMessages = Messages.loadMessages('prodlysfcli', 'prodly');

export default class ProdlyCheckin extends SfCommand<AnyJson> {
  public static readonly summary = commandMessages.getMessage('summary');
  public static readonly description = prodlyMessages.getMessage('commandDescription');
  public static readonly examples = commandMessages.getMessages('examples');

  public static readonly flags = {
    'target-dev-hub': Flags.requiredHub(),
    'target-org': Flags.requiredOrg(),
    branch: Flags.string({ char: 'b', summary: prodlyMessages.getMessage('branchFlagDescription') }),
    comment: Flags.string({ char: 'c', summary: prodlyMessages.getMessage('commentFlagDescription') }),
    dataset: Flags.string({ char: 't', summary: prodlyMessages.getMessage('dataSetFlagDescription') }),
    instance: Flags.string({ char: 'i', summary: prodlyMessages.getMessage('instanceFlagDescription') }),
    notes: Flags.string({ char: 'z', summary: prodlyMessages.getMessage('notesFlagDescription') }),
    plan: Flags.string({ char: 'p', summary: prodlyMessages.getMessage('deploymentPlanFlagDescription') }),
  };

  public async run(): Promise<AnyJson> {
    const { flags } = await this.parse(ProdlyCheckin);

    const {
      branch: branchFlag,
      comment: commentFlag,
      dataset: datasetFlag,
      instance: instanceFlag,
      notes: deploymentNotesFlag,
      plan: planFlag,
    } = flags;

    this.log('Instance flag: ' + instanceFlag);
    this.log('Deployment description flag: ' + deploymentNotesFlag);
    this.log('Comment flag: ' + commentFlag);
    this.log('Branch flag: ' + branchFlag);
    this.log('Data set flag: ' + datasetFlag);
    this.log('Deployment plan flag: ' + planFlag);

    const org = flags['target-org'];
    const hubOrg = flags['target-dev-hub'];
    const hubConn = hubOrg.getConnection();

    const print = (message: string | undefined, ...args: unknown[]): void => this.log(message, ...args);

    let mangedInstanceId = null;
    let dataSetId;
    let deploymentPlanId;

    // Retrieve the data set or deployment plan to deploy
    this.log('Retrieving data set or deployment plan to deploy.');
    if (datasetFlag !== undefined) {
      dataSetId = await getDeploymentEntityId({
        dataEntityFlag: datasetFlag,
        dataEntityType: 'PDRI__DataSet__c',
        hubConn,
        print,
      });
    } else if (planFlag !== undefined) {
      deploymentPlanId = await getDeploymentEntityId({
        dataEntityFlag: planFlag,
        dataEntityType: 'PDRI__Deployment_Plan__c',
        hubConn,
        print,
      });
    }

    this.log('Data set ID: ' + dataSetId);
    this.log('Deployment plan ID: ' + deploymentPlanId);

    // Check if instance is provided
    if (instanceFlag !== undefined) {
      // Use provided managed instance
      this.log(`Managed instance ID provided, using instance with id ${instanceFlag}`);
      mangedInstanceId = instanceFlag;
    } else {
      // Retrieve the managed instance associated with target org
      // DevHub control org is never used as the default
      const managedInstance = await getManagedInstance({ hubConn, orgId: org.getOrgId(), print });
      if (!managedInstance) {
        throw new SfError(prodlyMessages.getMessage('errorManagedInstaceNotFound'));
      }
      this.log(`Managed instance ID retrieved, using instance with id ${managedInstance.id}`);
      mangedInstanceId = managedInstance.id;

      this.log('Refreshing org session auth');
      try {
        await org.refreshAuth();
      } catch {
        // console.log('Target username not valid or not specified, refresh failed');
      }

      // Update the connection with the latest access token
      this.log('Updating the connection with the latest access token');
      await updateConnection({ connectionId: managedInstance.connectionId, hubConn, org });
    }

    // Perform the checkin
    await this.checkinInstance(
      mangedInstanceId,
      commentFlag,
      branchFlag,
      dataSetId,
      deploymentPlanId,
      deploymentNotesFlag,
      hubConn
    );

    return {};
  }

  private async checkinInstance(
    mangedInstanceId: string,
    comment: string | undefined,
    branchFlag: string | undefined,
    dataSetId: string | undefined,
    deploymentPlanId: string | undefined,
    deploymentNotes: string | undefined,
    hubConn: Connection
  ): Promise<void> {
    this.log(`Performing checkin for managed instance with id ${mangedInstanceId}.`);

    const path = `/services/apexrest/PDRI/v1/instances/${mangedInstanceId}/checkin`;

    const checkinInstance = {
      allVersionedData: !dataSetId && !deploymentPlanId ? true : null,
      branchName: branchFlag,
      datasetId: dataSetId,
      deploymentNotes,
      deploymentPlanId,
      options: { commitMessage: comment },
    };

    const request = {
      body: JSON.stringify(checkinInstance),
      method: 'POST' as const,
      // headers : { 'vcs-access-token': vcsToken },
      url: path,
    };

    await hubConn.request(request);
  }
}
