import { Messages, SfError } from '@salesforce/core';
import { Flags, SfCommand } from '@salesforce/sf-plugins-core';
import { getChangeType, getChangeTypes } from '../../services/change-types.js';
import { postInstances } from '../../services/manage-instances.js';
import { JSONObject } from '../../types/generic.js';
import { ChangeType } from '../../types/prodly.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const commandMessages = Messages.loadMessages('prodlysfcli', 'prodly.change-types');
const prodlyMessages = Messages.loadMessages('prodlysfcli', 'prodly');

export default class ProdlyChangeTypes extends SfCommand<JSONObject> {
  public static readonly summary = commandMessages.getMessage('summary');
  public static readonly description = prodlyMessages.getMessage('descriptionChangeTypesCommand');
  public static readonly examples = commandMessages.getMessages('examples');

  public static readonly flags = {
    'api-version': Flags.orgApiVersion(),
    'target-dev-hub': Flags.requiredHub(),
    id: Flags.string({ char: 't', summary: prodlyMessages.getMessage('changeTypeIdFlagDescription') }),
    list: Flags.boolean({ char: 'l', summary: prodlyMessages.getMessage('listChangeTypesFlagDescription') }),
    create: Flags.boolean({ char: 'c', summary: prodlyMessages.getMessage('createFromChangeTypeFlagDescription') }),
    name: Flags.string({ char: 'n', summary: prodlyMessages.getMessage('createFromChangeTypeNameFlagDescription') }),
    username: Flags.string({
      char: 'u',
      summary: prodlyMessages.getMessage('createFromChangeTypeUsernameFlagDescription'),
    }),
  };

  // eslint-disable-next-line complexity
  public async run(): Promise<JSONObject> {
    const { flags } = await this.parse(ProdlyChangeTypes);

    const { create, id, list, name, username } = flags;

    if (!create && !list) {
      throw new SfError('Must provide either --create or --list flag');
    }

    if (create && list) {
      throw new SfError('Cannot use --create and --list flags together');
    }

    if (create && (!name || !username || !id)) {
      throw new SfError('Must provide --name, --username, and --id flags when using --create');
    }

    const hubOrg = flags['target-dev-hub'];
    const hubConn = hubOrg.getConnection(flags['api-version']);

    if (list) {
      if (id) {
        const changeType = await getChangeType({ id, hubConn });
        if (!changeType) throw new SfError(`No change type found with id ${id}`);

        this.logChangeType(changeType);
        return changeType ?? {};
      }
      const changeTypes = await getChangeTypes({ hubConn });
      if (!changeTypes) throw new SfError('No change types found');

      changeTypes.forEach((changeType) => this.logChangeType(changeType));
      return changeTypes;
    }

    if (create && id && name && username) {
      const changeType = await getChangeType({ id, hubConn });
      if (!changeType) throw new SfError(`No change type found with id ${id}`);
      const { jobId } = await postInstances({
        body: {
          environment: {
            dataSetIds: changeType.dataset?.id ? [changeType.dataset.id] : [],
            deploymentPlanIds: changeType.deploymentPlan?.id ? [changeType.deploymentPlan.id] : [],
            durationDays: changeType.durationDays,
            envType: 'scratch_org',
            forceDataDeployment: changeType.skipDataOnMetadataFailure,
            metadataFilterId: changeType.metadataFilter?.id,
            metadataRollbackOnError: changeType.metadataRollbackOnFailure,
            orgName: name,
            packageIds: changeType.salesforcePackageIds,
            sourcePlatformInstanceId: changeType.managedEnvironment?.instanceId,
            username,
          },
        },
        hubConn,
      });
      this.log(`Scratch org creation job submitted with id ${jobId}`);
      return { jobId, message: 'Scratch org creation job submitted' };
    }

    return {};
  }

  private logChangeType(changeType: ChangeType): void {
    this.log('Name:', changeType.name);
    this.log('Id:', changeType.id);
    this.log('Generated Environment Type:', changeType.generatedEnvironmentType);
    this.log('Source:', `${changeType.managedEnvironment.instanceName} (${changeType.managedEnvironment.instanceId})`);

    if (changeType.salesforcePackageIds) {
      this.log('Salesforce Package Ids:', changeType.salesforcePackageIds.join(', '));
    }
    if (changeType.metadataFilter) {
      this.log('Metadata Filter:', `${changeType.metadataFilter.name} (${changeType.metadataFilter.id})`);
    }
    if (changeType.dataset) {
      this.log('Dataset:', `${changeType.dataset.name} (${changeType.dataset.id})`);
    }
    if (changeType.deploymentPlan) {
      this.log('Deployment Plan:', `${changeType.deploymentPlan.name} (${changeType.deploymentPlan.id})`);
    }

    this.log('Duration (days):', `${changeType.durationDays}\n`);
  }
}
