import { Connection, Messages, SfError } from '@salesforce/core';
import { Flags, SfCommand } from '@salesforce/sf-plugins-core';
import { AnyJson } from '@salesforce/ts-types';
import { updateConnection } from '../../services/connections.js';
import { getManagedInstance } from '../../services/instances.js';
import { getDeploymentEntityId } from '../../services/queries.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const commandMessages = Messages.loadMessages('prodlysfcli', 'prodly.checkout');
const prodlyMessages = Messages.loadMessages('prodlysfcli', 'prodly');

export default class ProdlyCheckout extends SfCommand<AnyJson> {
  public static readonly summary = commandMessages.getMessage('summary');
  public static readonly description = prodlyMessages.getMessage('commandDescription');
  public static readonly examples = commandMessages.getMessages('examples');

  public static readonly flags = {
    'target-dev-hub': Flags.requiredHub(),
    'target-org': Flags.requiredOrg(),
    branch: Flags.string({ char: 'b', summary: prodlyMessages.getMessage('branchFlagDescription') }),
    dataset: Flags.string({ char: 't', summary: prodlyMessages.getMessage('dataSetFlagDescription') }),
    deactivate: Flags.boolean({ char: 'e', summary: prodlyMessages.getMessage('deactivateFlagDescription') }),
    instance: Flags.string({ char: 'i', summary: prodlyMessages.getMessage('instanceFlagDescription') }),
    name: Flags.string({ char: 'n', summary: prodlyMessages.getMessage('deplomentNameFlagDescription') }),
    notes: Flags.string({ char: 'z', summary: prodlyMessages.getMessage('notesFlagDescription') }),
    plan: Flags.string({ char: 'p', summary: prodlyMessages.getMessage('deploymentPlanFlagDescription') }),
  };

  public async run(): Promise<AnyJson> {
    const { flags } = await this.parse(ProdlyCheckout);

    const {
      instance: instanceFlag,
      deactivate: deactivateFlag,
      name: deploymentNameFlag,
      notes: deploymentNotesFlag,
      branch: branchFlag,
      dataset: datasetFlag,
      plan: planFlag,
    } = flags;

    this.log('Deployment name flag: ' + deploymentNameFlag);
    this.log('Instance flag: ' + instanceFlag);
    this.log('Deactivate flag: ' + deactivateFlag);
    this.log('Deployment description flag: ' + deploymentNotesFlag);
    this.log('Branch flag: ' + branchFlag);
    this.log('Data set flag: ' + datasetFlag);
    this.log('Deployment plan flag: ' + planFlag);

    if (!datasetFlag && !planFlag) {
      throw new SfError(prodlyMessages.getMessage('errorNoDatasetAndPlanFlags', []));
    }

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
      const managedInstance = await getManagedInstance({ orgId: org.getOrgId(), hubConn, print });
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
      await updateConnection({ connectionId: managedInstance.connectionId, org, hubConn});
    }

    // Perform the checkout
    await this.checkoutInstance(
      mangedInstanceId,
      deactivateFlag,
      branchFlag,
      dataSetId,
      deploymentPlanId,
      deploymentNotesFlag,
      deploymentNameFlag,
      hubConn
    );

    return {};
  }

  private async checkoutInstance(
    mangedInstanceId: string,
    deactivateAllEvents: boolean,
    branchFlag: string | undefined,
    dataSetId: string | undefined,
    deploymentPlanId: string | undefined,
    deploymentNotes: string | undefined,
    deploymentNameFlag: string | undefined,
    hubConn: Connection
  ): Promise<void> {
    this.log(`Performing checkout for managed instance with id ${mangedInstanceId}.`);

    const path = '/services/apexrest/PDRI/v1/instances/' + mangedInstanceId + '/checkout';

    /* let eventControlOptions = {
        deactivateAll : deactivateAllEvents === undefined ? false : true
    }*/

    const checkoutInstance = {
      // eventControlOptions : eventControlOptions
      allVersionedData: !dataSetId && !deploymentPlanId ? true : null,
      branchName: branchFlag,
      datasetId: dataSetId,
      deactivateAll: deactivateAllEvents === undefined ? false : true,
      deploymentName: deploymentNameFlag,
      deploymentNotes,
      deploymentPlanId,
    };

    const request = {
      body: JSON.stringify(checkoutInstance),
      method: 'POST' as const,
      // headers : { 'vcs-access-token': vcsToken },
      url: path,
    };

    await hubConn.request(request);
  }
}
