import { Messages, SfError } from '@salesforce/core';
import { Flags, JsonObject, SfCommand } from '@salesforce/sf-plugins-core';
import { createConnection, getConnectionId, updateConnection } from '../../services/connections.js';
import { getManagedInstance, manageInstance } from '../../services/instances.js';
import { getDeploymentEntityId } from '../../services/queries.js';
import { DeployOptions, Jobs } from '../../types/prodly.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const commandMessages = Messages.loadMessages('prodlysfcli', 'prodly.deploy');
const prodlyMessages = Messages.loadMessages('prodlysfcli', 'prodly');

export type ProdlyDeployResult = {
  path: string;
};

export default class ProdlyDeploy extends SfCommand<JsonObject> {
  public static readonly summary = commandMessages.getMessage('summary');
  public static readonly description = prodlyMessages.getMessage('commandDescription');
  public static readonly examples = commandMessages.getMessages('examples');

  public static readonly flags = {
    'target-dev-hub': Flags.requiredHub(),
    'target-org': Flags.requiredOrg(),
    dataset: Flags.string({ char: 't', summary: prodlyMessages.getMessage('dataSetFlagDescription') }),
    deactivate: Flags.boolean({ char: 'e', summary: prodlyMessages.getMessage('deactivateFlagDescription') }),
    destination: Flags.string({ char: 'd', summary: prodlyMessages.getMessage('destinationFlagDescription') }),
    filter: Flags.string({ char: 'q', summary: prodlyMessages.getMessage('queryFilterFlagDescription') }),
    label: Flags.string({ char: 'b', summary: prodlyMessages.getMessage('instanceNameFlagDescription') }),
    name: Flags.string({ char: 'n', summary: prodlyMessages.getMessage('deplomentNameFlagDescription') }),
    notes: Flags.string({ char: 'z', summary: prodlyMessages.getMessage('notesFlagDescription') }),
    plan: Flags.string({ char: 'p', summary: prodlyMessages.getMessage('deploymentPlanFlagDescription') }),
    simulation: Flags.boolean({ char: 'l', summary: prodlyMessages.getMessage('simulationFlagDescription') }),
    source: Flags.string({ char: 's', summary: prodlyMessages.getMessage('sourceFlagDescription') }),
  };

  public async run(): Promise<JsonObject> {
    const { flags } = await this.parse(ProdlyDeploy);
    const {
      dataset: datasetFlag,
      deactivate: deactivateFlag,
      destination: destinationFlag,
      filter: queryFilterFlag,
      label: labelFlag,
      name: deploymentNameFlag,
      notes: deploymentNotesFlag,
      plan: planFlag,
      simulation: simulationFlag,
      source: sourceFlag,
    } = flags;
    const isOrgSpecified = sourceFlag !== undefined || destinationFlag !== undefined;

    this.log('Deployment name flag: ' + deploymentNameFlag);
    this.log('Deployment description flag: ' + deploymentNotesFlag);
    this.log('Source instance flag: ' + sourceFlag);
    this.log('Destination instance flag: ' + destinationFlag);
    this.log('Data set flag: ' + datasetFlag);
    this.log('Deployment plan flag: ' + planFlag);
    this.log('Instance name flag: ' + labelFlag);
    this.log('Deactivate flag: ' + deactivateFlag);
    this.log('Simulation flag: ' + simulationFlag);
    this.log('Query filter flag: ' + queryFilterFlag);

    if (!datasetFlag && !planFlag) {
      throw new SfError(prodlyMessages.getMessage('errorNoDatasetAndPlanFlags', []));
    }
    if (datasetFlag && planFlag) {
      throw new SfError(prodlyMessages.getMessage('errorDatasetAndPlanFlags', []));
    }

    const org = flags['target-org'];
    const hubOrg = flags['target-dev-hub'];
    const hubConn = hubOrg.getConnection();
    const print = (message: string | undefined, ...args: unknown[]): void => this.log(message, ...args);

    let sourceInstanceId;
    let destinationInstanceId;
    let dataSetId;
    let deploymentPlanId;

    // Four posibilities:
    // 1. Source and destination instance params are provided, deploy from source to destination instance
    // 2. Source instance and dx org param are provided, deploy from source instance to dx org instance
    // 3. Destination instance and dx org param are provided, deploy from dx org instance to destination instance
    // 4. Only dx org param is provided, deploy from devhub/control org to the destination instance.
    //
    // Any auto managed instances, and its associated auto created connections, will only contain a short lived refresh token
    // This means that for any subsequent deployments the refresh token needs to be updated with the latest
    // Which can only happen if we have a provided target username parameter for the instance org
    // So only the source or destination instance can be an auto managed

    // Set source mamanaged instance
    if (sourceFlag) {
      // Source and/or destination is a managed instance and the other is a DX managed org
      this.log(`Source managed instance parameter is specified: ${sourceFlag}`);
      // Source is a managed instance, use the managed instance ID
      sourceInstanceId = sourceFlag;
    } else if (isOrgSpecified) {
      // Source is a DX managed org
      this.log(
        `Source managed instance parameter is not specified, finding or creating managed instance by org ID: ${org.getOrgId()}`
      );

      // Check if a managed instance exist with the same org ID
      let managedInstance = await getManagedInstance({ hubConn, orgId: org.getOrgId(), print });
      this.log(`Retrieved managed instance: ${JSON.stringify(managedInstance)}`);
      if (managedInstance) {
        // If exists, use that managed instance ID
        this.log(`Managed instance found, using it, with ID: ${managedInstance.id}`);
        sourceInstanceId = managedInstance.id;

        // Update the connection with the latest access token
        this.log('Updating the connection with the latest access token');
        await updateConnection({ connectionId: managedInstance.connectionId, hubConn, org });
      } else {
        this.log('Managed instance for the org does not exist, managing instance.');
        // If doesn't exist, query for an active connection to the org
        let connectionId = await getConnectionId({ hubConn, orgId: org.getOrgId(), print });
        this.log(`Retrieved connection ID: ${connectionId}`);
        if (!connectionId) {
          // If a connection doesn't exist, create it, then use it to manage the new instance
          this.log('Connection does not exist, creating.');
          connectionId = await createConnection({ hubConn, name: labelFlag, org });
          this.log(`Created connection with record ID: ${connectionId}`);
        } else {
          // Update the connection with the latest access token
          this.log('Updating the connection with the latest access token');
          await updateConnection({ connectionId, hubConn, org });
        }
        // Connection exists, use it to manage the new instance
        const orgId = org.getOrgId();
        const { managedInstance: newManagedInstance } = await manageInstance({
          body: {
            platformInstance: {
              platformInstanceId: orgId,
              connectionId,
            },
          },
          hubConn,
          orgId,
        });
        managedInstance = newManagedInstance;
        this.log(`New managed instance: ${managedInstance.id}`);

        sourceInstanceId = managedInstance.id;
      }
    } else {
      // Source is the dev hub/control org
      this.log(
        `Source and Destination not specified, setting hub as the source, org ID: ${hubConn.getAuthInfoFields().orgId}`
      );

      const managedInstance = await getManagedInstance({ hubConn, orgId: hubConn.getAuthInfoFields().orgId, print });
      this.log(`Retrieved managed instance ID for the control org: ${managedInstance?.id}`);

      if (!managedInstance) {
        throw new SfError('No managed instance found for the devhub/control org.');
      }

      sourceInstanceId = managedInstance.id;
    }

    if (destinationFlag) {
      this.log('Destination managed instance parameter is specified: ', sourceFlag);
      // Destination is a managed instance, use the managed instance ID
      destinationInstanceId = destinationFlag;
    } else {
      // Destination is a DX managed org
      this.log(
        `Destination managed instance parameter is not specified, finding or creating managed instance by org ID: ${org.getOrgId()}`
      );

      // Check if a managed instance exist with the same org ID
      let managedInstance = await getManagedInstance({ hubConn, orgId: org.getOrgId(), print });
      this.log('Retrieved managed instance: ', JSON.stringify(managedInstance));
      if (managedInstance) {
        // If exists, use that managed instance ID
        this.log(`Managed instance found, using it, with ID: ${managedInstance?.id}`);
        destinationInstanceId = managedInstance?.id;

        // Update the connection with the latest access token
        this.log('Updating the connection with the latest access token');
        await updateConnection({ connectionId: managedInstance.connectionId, hubConn, org });
      } else {
        this.log('Managed instance for the org does not exist, managing instance.');
        // If doesn't exist, query for an active connection to the org
        let connectionId = await getConnectionId({ hubConn, orgId: org.getOrgId(), print });
        this.log('Retrieved connection ID: ', connectionId);
        if (!connectionId) {
          // If a connection doesn't exist, create it, then use it to manage the new instance
          this.log('Connection does not exist, creating.');
          connectionId = await createConnection({ hubConn, name: labelFlag, org });
          this.log(`Created connection with record ID: ${connectionId}`);
        } else {
          // Update the connection with the latest access token
          this.log('Updating the connection with the latest access token');
          await updateConnection({ connectionId, hubConn, org });
        }
        // Connection exists, use it to manage the new instance
        const orgId = org.getOrgId();
        const body = {
          platformInstance: {
            platformInstanceId: orgId,
            connectionId,
          },
        };
        const { managedInstance: newManagedInstance } = await manageInstance({
          body,
          hubConn,
          orgId,
        });
        managedInstance = newManagedInstance;
        this.log(`New managed instance ID: ${managedInstance.id}`);

        destinationInstanceId = managedInstance.id;
      }
    }

    this.log('Refreshing org session auth');
    try {
      await org.refreshAuth();
    } catch {
      // Target username not valid or not specified, refresh failed
    }

    // Retrieve the data set or deployment plan to deploy
    this.log('Retrieving data set or deployment plan to deploy.');
    if (datasetFlag) {
      dataSetId = await getDeploymentEntityId({
        dataEntityFlag: datasetFlag,
        dataEntityType: 'PDRI__DataSet__c',
        hubConn,
        print,
      });
    } else if (planFlag) {
      deploymentPlanId = await getDeploymentEntityId({
        dataEntityFlag: planFlag,
        dataEntityType: 'PDRI__Deployment_Plan__c',
        hubConn,
        print,
      });
    }
    this.log('Launching deployment.');
    const jobId = await this.deploy({
      dataSetId,
      deactivateAllEvents: deactivateFlag,
      deploymentName: deploymentNameFlag,
      deploymentNotes: deploymentNotesFlag,
      deploymentPlanId,
      destinationInstanceId,
      hubConn,
      queryFilter: queryFilterFlag,
      simulation: simulationFlag,
      sourceInstanceId,
    });

    this.log(`Deployment launched with Job ID: ${jobId}`);

    // Return an object to be displayed with --json
    return { jobId, message: 'Deployment launched' };
  }

  private async deploy({
    dataSetId,
    deactivateAllEvents,
    deploymentName,
    deploymentNotes,
    deploymentPlanId,
    destinationInstanceId,
    hubConn,
    queryFilter,
    simulation,
    sourceInstanceId,
  }: DeployOptions): Promise<string> {
    this.log('Invoking deployment.');

    const path = `/services/apexrest/PDRI/v1/instances/${destinationInstanceId}/deploy`;

    const eventControlOptions = {
      deactivateAll: !!deactivateAllEvents,
    };

    const queryFilterOptions = {
      filter: queryFilter ?? undefined,
    };

    const dataDeploymentOptions = {
      dataSetId,
      deploymentPlanId,
      simulation: simulation ?? false,
      eventControlOptions,
      queryFilter: queryFilterOptions,
    };

    const sourceOptions = {
      managedInstanceId: sourceInstanceId,
    };

    const deployInstance = {
      deploymentName,
      deploymentNotes,
      engagementId: null,
      data: [dataDeploymentOptions],
      metadata: {},
      source: sourceOptions,
    };

    const request = {
      body: JSON.stringify(deployInstance),
      method: 'POST' as const,
      url: path,
    };

    const res: string = await hubConn.request(request);
    const jobsWrapper = JSON.parse(res) as Jobs;

    const jobId = jobsWrapper.jobs[0].id;

    return jobId;
  }
}
