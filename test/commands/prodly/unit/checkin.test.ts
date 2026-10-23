import { Messages, SfError } from '@salesforce/core';
import { MockTestOrgData, TestContext } from '@salesforce/core/testSetup';
import { AnyJson } from '@salesforce/ts-types';
import { expect } from 'chai';
import ProdlyCheckin from '../../../../src/commands/prodly/checkin.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const prodlyMessages = Messages.loadMessages('prodlysfcli', 'prodly');

describe('prodly:checkin', () => {
  const $$ = new TestContext();

  afterEach(() => {
    $$.restore();
  });

  it('should throw an error when target dev hub is not provided', async () => {
    try {
      await ProdlyCheckin.run(['--target-org', 'test']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include('No default dev hub found');
      }
    }
  });

  it('should throw an error when target org is not provided', async () => {
    try {
      await ProdlyCheckin.run(['--target-dev-hub', 'test']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include('No default environment found');
      }
    }
  });

  it('should throw an error when comment flag is not provided.', async () => {
    try {
      await ProdlyCheckin.run(['--target-org', 'test', '--target-dev-hub', 'test']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include('Missing required flag comment');
      }
    }
  });

  it('should throw an error when data set or deployment flags are not provided.', async () => {
    try {
      await ProdlyCheckin.run(['--target-org', 'test', '--target-dev-hub', 'test', '--comment', 'test']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include(prodlyMessages.getMessage('errorNoDatasetAndPlanFlags', []));
      }
    }
  });

  it('should throw an error when query filter flag is provided without a dataset flag', async () => {
    try {
      await ProdlyCheckin.run([
        '--target-org',
        'test',
        '--target-dev-hub',
        'test',
        '--comment',
        'test',
        '--filter',
        'test',
      ]);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include('All of the following must be provided when using --filter: --dataset');
      }
    }
  });

  it('should throw an error when both data set and deployment flags are provided.', async () => {
    try {
      await ProdlyCheckin.run([
        '--target-org',
        'test',
        '--target-dev-hub',
        'test',
        '--comment',
        'test',
        '--dataset',
        'test',
        '--plan',
        'test',
      ]);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include(prodlyMessages.getMessage('errorDatasetAndPlanFlags', []));
      }
    }
  });

  it('should not require dataset or plan when metadata quick select components are provided.', async () => {
    try {
      await ProdlyCheckin.run([
        '--target-org',
        'test',
        '--target-dev-hub',
        'test',
        '--comment',
        'test',
        '--metadata-quick-select-components',
        '[{"type":"Profile","ids":["Profile1"]}]',
      ]);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.not.include(prodlyMessages.getMessage('errorNoDatasetAndPlanFlags', []));
      }
    }
  });

  describe('checkin request', () => {
    const testOrg = new MockTestOrgData();
    const hubOrg = new MockTestOrgData();
    hubOrg.makeDevHub();
    let checkinBody: { dataFolder?: string; metadataFolder?: string } | undefined;

    const runCheckin = (flags: string[]): Promise<unknown> =>
      ProdlyCheckin.run([
        '--target-org',
        testOrg.username,
        '--target-dev-hub',
        hubOrg.username,
        '--instance',
        'f50616b6-57b1-4941-802f-ee0e2506f217',
        '--comment',
        'CI checkin',
        '--metadata-quick-select-components',
        '[{"type":"ApexClass","ids":["Foo"]}]',
        ...flags,
      ]);

    beforeEach(async () => {
      checkinBody = undefined;
      await $$.stubAuths(testOrg, hubOrg);
      $$.fakeConnectionRequest = (request: AnyJson): Promise<AnyJson> => {
        const { body, url } = request as { body: string; url: string };
        if (url.endsWith('/services/apexrest/PDRI/v1/instances/f50616b6-57b1-4941-802f-ee0e2506f217/checkin')) {
          checkinBody = JSON.parse(body) as typeof checkinBody;
          return Promise.resolve(JSON.stringify({ jobs: [{ id: 'job-1' }] }));
        }
        return Promise.reject(new Error(`Unexpected request: ${url}`));
      };
    });

    it('sends the metadata folder and data folder ids', async () => {
      const result = await runCheckin([
        '--metadata-folder',
        'a3di8000000AVc1AAG',
        '--data-folder',
        'a3di8000000AVaPAAW',
      ]);

      expect(result).to.deep.equal({ jobId: 'job-1', message: 'Checkin launched' });
      expect(checkinBody?.metadataFolder).to.equal('a3di8000000AVc1AAG');
      expect(checkinBody?.dataFolder).to.equal('a3di8000000AVaPAAW');
    });

    it('leaves the folders to the server defaults when they are not given', async () => {
      await runCheckin([]);

      expect(checkinBody).to.not.have.property('metadataFolder');
      expect(checkinBody).to.not.have.property('dataFolder');
    });
  });
});
