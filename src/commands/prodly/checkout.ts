import { Messages, SfError } from '@salesforce/core';
import { Flags, SfCommand } from '@salesforce/sf-plugins-core';
import {
  constructApexTestClasses,
  constructQueryFilter,
  constructQuickDeploymentComponents,
} from '../../helpers/index.js';
import { updateConnection } from '../../services/connections.js';
import { getManagedInstance } from '../../services/manage-instances.js';
import { getDeploymentEntityId } from '../../services/queries.js';
import { JSONObject } from '../../types/generic.js';
import { CheckoutOptions, Jobs } from '../../types/prodly.js';
import { TEST_OPTIONS, TTestOption } from '../../constants/index.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const commandMessages = Messages.loadMessages('prodlysfcli', 'prodly.checkout');
const prodlyMessages = Messages.loadMessages('prodlysfcli', 'prodly');

export default class ProdlyCheckout extends SfCommand<JSONObject> {
  public static readonly summary = commandMessages.getMessage('summary');
  public static readonly description = prodlyMessages.getMessage('descriptionCheckoutCommand');
  public static readonly examples = commandMessages.getMessages('examples');

  public static readonly flags = {
    'apex-test-classes': Flags.string({
      char: 'a',
      summary: prodlyMessages.getMessage('apexTestClassesFlagDescription'),
      dependsOn: ['test-option'],
    }),
    'data-folder': Flags.string({ char: 'f', summary: prodlyMessages.getMessage('dataBranchFolderFlagDescription') }),
    'target-dev-hub': Flags.requiredHub(),
    'target-org': Flags.requiredOrg(),
    'test-option': Flags.string({
      char: 'r',
      summary: prodlyMessages.getMessage('testOptionFlagDescription'),
      dependsOn: ['metadata-quick-select-components'],
      options: TEST_OPTIONS,
    }),
    'metadata-quick-select-components': Flags.string({
      char: 'm',
      summary: prodlyMessages.getMessage('metadataQuickSelectComponentsFlagDescription'),
    }),
    branch: Flags.string({ char: 'b', summary: prodlyMessages.getMessage('branchFlagDescription') }),
    dataset: Flags.string({ char: 't', summary: prodlyMessages.getMessage('dataSetFlagDescription') }),
    deactivate: Flags.boolean({ char: 'e', summary: prodlyMessages.getMessage('deactivateFlagDescription') }),
    filter: Flags.string({ char: 'q', summary: prodlyMessages.getMessage('queryFilterFlagDescription') }),
    instance: Flags.string({ char: 'i', summary: prodlyMessages.getMessage('instanceFlagDescription') }),
    name: Flags.string({ char: 'n', summary: prodlyMessages.getMessage('deplomentNameFlagDescription') }),
    notes: Flags.string({ char: 'z', summary: prodlyMessages.getMessage('notesFlagDescription') }),
    plan: Flags.string({ char: 'p', summary: prodlyMessages.getMessage('deploymentPlanFlagDescription') }),
    simulation: Flags.boolean({ char: 'l', summary: prodlyMessages.getMessage('simulationFlagDescription') }),
  };

  public async run(): Promise<JSONObject> {
    const { flags } = await this.parse(ProdlyCheckout);

    const {
      'apex-test-classes': apexTestClassesFlag,
      'metadata-quick-select-components': metadataQuickSelectComponentsFlag,
      'test-option': testOptionFlag,
      branch: branchFlag,
      dataset: datasetFlag,
      deactivate: deactivateFlag,
      filter: queryFilterFlag,
      instance: instanceFlag,
      name: deploymentNameFlag,
      notes: deploymentNotesFlag,
      plan: planFlag,
      simulation: simulationFlag,
    } = flags;

    this.log('Deployment name flag: ' + deploymentNameFlag);
    this.log('Instance flag: ' + instanceFlag);
    this.log('Deactivate flag: ' + deactivateFlag);
    this.log('Deployment description flag: ' + deploymentNotesFlag);
    this.log('Branch flag: ' + branchFlag);
    this.log('Data folder flag: ' + flags['data-folder']);
    this.log('Data set flag: ' + datasetFlag);
    this.log('Deployment plan flag: ' + planFlag);
    this.log('Simulation flag: ' + simulationFlag);
    this.log('Query filter flag: ' + queryFilterFlag);
    this.log('Metadata quick select components flag: ' + metadataQuickSelectComponentsFlag);
    this.log('Test option flag: ' + testOptionFlag);
    this.log('Apex test classes flag: ' + apexTestClassesFlag);

    const hasMetadataQuickSelectComponents = metadataQuickSelectComponentsFlag !== undefined;

    // When no metadata quick select components are provided, require either dataset or plan (but not both)
    if (!hasMetadataQuickSelectComponents && !datasetFlag && !planFlag) {
      throw new SfError(prodlyMessages.getMessage('errorNoDatasetAndPlanFlags', []));
    }

    if (!deploymentNameFlag) {
      throw new SfError(prodlyMessages.getMessage('errorDeploymentNameFlag', []));
    }

    if (!datasetFlag && queryFilterFlag) {
      throw new SfError(prodlyMessages.getMessage('errorQueryFilterFlag', []));
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
      await updateConnection({ connectionId: managedInstance.connectionId, org, hubConn });
    }

    // Perform the checkout
    const jobId = await this.checkoutInstance({
      apexTestClasses: apexTestClassesFlag,
      branchFlag,
      dataFolder: flags['data-folder'],
      dataSetId,
      deactivateAllEvents: deactivateFlag,
      deploymentNameFlag,
      deploymentNotes: deploymentNotesFlag,
      deploymentPlanId,
      filter: queryFilterFlag,
      hubConn,
      mangedInstanceId,
      quickDeploymentComponents: constructQuickDeploymentComponents(metadataQuickSelectComponentsFlag),
      simulation: simulationFlag,
      testLevel: testOptionFlag as TTestOption,
    });

    this.log(`Checkout launched with Job ID: ${jobId}`);
    return { jobId, message: 'Checkout launched' };
  }

  private async checkoutInstance({
    apexTestClasses,
    branchFlag,
    dataFolder,
    dataSetId,
    deactivateAllEvents,
    deploymentNameFlag,
    deploymentNotes,
    deploymentPlanId,
    filter,
    hubConn,
    mangedInstanceId,
    quickDeploymentComponents,
    simulation,
    testLevel,
  }: CheckoutOptions): Promise<string> {
    this.log(`Performing checkout for managed instance with id ${mangedInstanceId}.`);

    const path = `/services/apexrest/PDRI/v1/instances/${mangedInstanceId}/checkout`;

    const checkoutInstance = {
      branchName: branchFlag,
      dataFolder,
      datasetId: dataSetId,
      deactivateAll: deactivateAllEvents === undefined ? false : true,
      deploymentName: deploymentNameFlag,
      deploymentNotes,
      deploymentPlanId,
      metadata: quickDeploymentComponents
        ? {
            apexTestClasses: constructApexTestClasses(apexTestClasses, testLevel),
            quickDeploymentComponents,
            testLevel,
            validation: simulation ?? false,
          }
        : {},
      queryFilter: constructQueryFilter(filter),
      validation: simulation ?? false,
    };

    const request = {
      body: JSON.stringify(checkoutInstance),
      method: 'POST' as const,
      url: path,
    };

    const res: string = await hubConn.request(request);
    const jobsWrapper = JSON.parse(res) as Jobs;

    const jobId = jobsWrapper.jobs[0].id;

    return jobId;
  }
}
