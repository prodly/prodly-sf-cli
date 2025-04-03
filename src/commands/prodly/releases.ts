import { Messages, SfError } from '@salesforce/core';
import { Flags, SfCommand } from '@salesforce/sf-plugins-core';
import { getReleases } from '../../services/release-configurations.js';
import { postReleases } from '../../services/releases.js';
import { JSONObject } from '../../types/generic.js';
import { ReleaseConfiguration } from '../../types/prodly.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const commandMessages = Messages.loadMessages('prodlysfcli', 'prodly.change-types');
const prodlyMessages = Messages.loadMessages('prodlysfcli', 'prodly');

export default class ProdlyReleases extends SfCommand<JSONObject> {
  public static readonly summary = commandMessages.getMessage('summary');
  public static readonly description = prodlyMessages.getMessage('descriptionChangeTypesCommand');
  public static readonly examples = commandMessages.getMessages('examples');

  public static readonly flags = {
    'api-version': Flags.orgApiVersion(),
    'target-dev-hub': Flags.requiredHub(),
    'deactivate-all-events': Flags.boolean({
      char: 'a',
      relationships: [{ type: 'some', flags: ['deploy'] }],
      summary: prodlyMessages.getMessage('deactivateAllReleaseEventsFlagDescription'),
    }),
    'release-id': Flags.string({
      char: 'r',
      relationships: [{ type: 'some', flags: ['deploy'] }],
      summary: prodlyMessages.getMessage('releaseIdFlagDescription'),
    }),
    deploy: Flags.boolean({
      char: 'd',
      dependsOn: ['instance', 'release-id'],
      exactlyOne: ['list'],
      summary: prodlyMessages.getMessage('deployReleaseFlagDescription'),
    }),
    instance: Flags.string({ char: 'i', summary: prodlyMessages.getMessage('instanceFlagDescription') }),
    list: Flags.boolean({
      char: 'l',
      exactlyOne: ['deploy'],
      exclusive: ['deploy', 'release-id'],
      summary: prodlyMessages.getMessage('listReleasesFlagDescription'),
    }),
    validation: Flags.boolean({
      char: 'n',
      relationships: [{ type: 'some', flags: ['deploy'] }],
      summary: prodlyMessages.getMessage('validationFlagDescription'),
    }),
  };

  public async run(): Promise<JSONObject> {
    const { flags } = await this.parse(ProdlyReleases);

    const { list } = flags;

    const hubOrg = flags['target-dev-hub'];
    const hubConn = hubOrg.getConnection(flags['api-version']);

    if (list) {
      const releases = await getReleases({ hubConn });
      if (!releases) throw new SfError('No releases found');
      releases.forEach((release) => this.logRelease(release));
      return releases;
    }

    const { jobId } = await postReleases({
      body: {
        deactivateAllEvents: flags['deactivate-all-events'],
        releaseId: flags['release-id'],
        targetManagedInstanceId: flags.instance,
        validation: flags.validation,
      },
      hubConn,
    });
    this.log(`Release launched with Job ID: ${jobId}`);
    return { jobId, message: 'Release launched' };
  }

  private logRelease(release: ReleaseConfiguration): void {
    this.log('Name:', release.PDRI__Release_Name__c);
    this.log('ID:', release.Id);
    this.log('Description:', release?.PDRI__Description__c ?? '');
    this.log('Status:', release?.PDRI__Status__c);
    this.log('Created Date:', release.CreatedDate);
    this.log('Created By:', `${release.CreatedBy?.Name ?? ''}\n`);
  }
}
