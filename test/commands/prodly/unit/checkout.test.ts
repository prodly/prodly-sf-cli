import { Messages, SfError } from '@salesforce/core';
import { MockTestOrgData, TestContext } from '@salesforce/core/testSetup';
import { AnyJson } from '@salesforce/ts-types';
import { expect } from 'chai';
import ProdlyCheckout from '../../../../src/commands/prodly/checkout.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const prodlyMessages = Messages.loadMessages('prodlysfcli', 'prodly');

describe('prodly:checkout', () => {
  const $$ = new TestContext();

  afterEach(() => {
    $$.restore();
  });

  it('should throw an error when target dev hub is not provided', async () => {
    try {
      await ProdlyCheckout.run(['--target-org', 'test']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include('No default dev hub found');
      }
    }
  });

  it('should throw an error when target org is not provided', async () => {
    try {
      await ProdlyCheckout.run(['--target-dev-hub', 'test']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include('No default environment found');
      }
    }
  });

  it('should throw an error when data set or deployment flags are not provided.', async () => {
    try {
      await ProdlyCheckout.run(['--target-org', 'test', '--target-dev-hub', 'test']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include(prodlyMessages.getMessage('errorNoDatasetAndPlanFlags', []));
      }
    }
  });

  it('should throw an error when data set or deployment flags are provided but deployment name flag is not provided.', async () => {
    try {
      await ProdlyCheckout.run(['--target-org', 'test', '--target-dev-hub', 'test', '-t', 'test']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include(prodlyMessages.getMessage('errorDeploymentNameFlag', []));
      }
    }
    try {
      await ProdlyCheckout.run(['--target-org', 'test', '--target-dev-hub', 'test', '-p', 'test']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include(prodlyMessages.getMessage('errorDeploymentNameFlag', []));
      }
    }
  });

  it('should throw an error when query filter flag is provided without a dataset flag', async () => {
    try {
      await ProdlyCheckout.run([
        '--target-org',
        'test',
        '--target-dev-hub',
        'test',
        '--name',
        'test',
        '--plan',
        'test',
        '--filter',
        'test',
      ]);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include(prodlyMessages.getMessage('errorQueryFilterFlag', []));
      }
    }
  });

  it('should throw an error when both dataset and plan flags are provided.', async () => {
    let caught: unknown;
    try {
      await ProdlyCheckout.run([
        '--target-org',
        'test',
        '--target-dev-hub',
        'test',
        '--name',
        'test',
        '--dataset',
        'test',
        '--plan',
        'test',
      ]);
    } catch (error) {
      caught = error;
    }
    expect(caught).to.be.instanceOf(SfError);
    expect((caught as SfError).message).to.include(prodlyMessages.getMessage('errorDatasetAndPlanFlags', []));
  });

  it('should not require dataset or plan when metadata quick select components are provided.', async () => {
    try {
      await ProdlyCheckout.run([
        '--target-org',
        'test',
        '--target-dev-hub',
        'test',
        '--name',
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

  it('should throw an error when test-option flag is provided without metadata quick select components to deploy or delete', async () => {
    let caught: unknown;
    try {
      await ProdlyCheckout.run([
        '--target-org',
        'test',
        '--target-dev-hub',
        'test',
        '--name',
        'test',
        '--test-option',
        'RunLocalTests',
        '--dataset',
        'test',
      ]);
    } catch (error) {
      caught = error;
    }
    expect((caught as Error).message).to.include(
      'One of the following must be provided when using --test-option: --metadata-quick-select-components, --metadata-quick-select-components-to-delete'
    );
  });

  it('should throw an error when destructive-changes-order flag is provided without components to delete', async () => {
    let caught: unknown;
    try {
      await ProdlyCheckout.run([
        '--target-org',
        'test',
        '--target-dev-hub',
        'test',
        '--name',
        'test',
        '--metadata-quick-select-components',
        '[{"type":"ApexClass","ids":["Foo"]}]',
        '--destructive-changes-order',
        'post',
      ]);
    } catch (error) {
      caught = error;
    }
    expect((caught as Error).message).to.include(
      'All of the following must be provided when using --destructive-changes-order: --metadata-quick-select-components-to-delete'
    );
  });

  describe('checkout request', () => {
    const testOrg = new MockTestOrgData();
    const hubOrg = new MockTestOrgData();
    hubOrg.makeDevHub();
    let checkoutBody: { dataFolder?: string; metadata: Record<string, unknown>; metadataFolder?: string } | undefined;

    const runCheckout = (flags: string[]): Promise<unknown> =>
      ProdlyCheckout.run([
        '--target-org',
        testOrg.username,
        '--target-dev-hub',
        hubOrg.username,
        '--instance',
        'f50616b6-57b1-4941-802f-ee0e2506f217',
        '--name',
        'CI deployment',
        ...flags,
      ]);

    beforeEach(async () => {
      checkoutBody = undefined;
      await $$.stubAuths(testOrg, hubOrg);
      $$.fakeConnectionRequest = (request: AnyJson): Promise<AnyJson> => {
        const { body, url } = request as { body: string; url: string };
        if (url.endsWith('/services/apexrest/PDRI/v1/instances/f50616b6-57b1-4941-802f-ee0e2506f217/checkout')) {
          checkoutBody = JSON.parse(body) as typeof checkoutBody;
          return Promise.resolve(JSON.stringify({ jobs: [{ id: 'job-1' }] }));
        }
        return Promise.reject(new Error(`Unexpected request: ${url}`));
      };
    });

    it('sends only the components to deploy when no components to delete are given', async () => {
      const result = await runCheckout([
        '--metadata-quick-select-components',
        '[{"type":"ApexClass","ids":["Foo"]}]',
        '--test-option',
        'RunLocalTests',
      ]);

      expect(result).to.deep.equal({ jobId: 'job-1', message: 'Checkout launched' });
      expect(checkoutBody?.metadata).to.deep.equal({
        quickDeploymentComponents: [{ type: 'ApexClass', ids: ['Foo'] }],
        testLevel: 'RunLocalTests',
      });
      expect(checkoutBody).to.not.have.property('metadataFolder');
    });

    it('sends the metadata folder and data folder ids', async () => {
      await runCheckout([
        '--metadata-quick-select-components',
        '[{"type":"ApexClass","ids":["Foo"]}]',
        '--metadata-folder',
        'a3di8000000AVc1AAG',
        '--data-folder',
        'a3di8000000AVaPAAW',
      ]);

      expect(checkoutBody?.metadataFolder).to.equal('a3di8000000AVc1AAG');
      expect(checkoutBody?.dataFolder).to.equal('a3di8000000AVaPAAW');
    });

    it('sends a delete-only checkout without a data set, plan or components to deploy', async () => {
      const result = await runCheckout([
        '--metadata-quick-select-components-to-delete',
        '[{"type":"ApexClass","ids":["OldClass"]},{"type":"CustomField","ids":["Account.Old__c"]}]',
        '--destructive-changes-order',
        'post',
      ]);

      expect(result).to.deep.equal({ jobId: 'job-1', message: 'Checkout launched' });
      expect(checkoutBody?.metadata).to.deep.equal({
        quickDeploymentComponentsToDelete: [
          { type: 'ApexClass', ids: ['OldClass'] },
          { type: 'CustomField', ids: ['Account.Old__c'] },
        ],
        destructiveChangesOrder: 'post',
      });
    });

    it('leaves the destructive changes order to the server when it is not given', async () => {
      await runCheckout(['--metadata-quick-select-components-to-delete', '[{"type":"ApexClass","ids":["OldClass"]}]']);

      expect(checkoutBody?.metadata).to.deep.equal({
        quickDeploymentComponentsToDelete: [{ type: 'ApexClass', ids: ['OldClass'] }],
      });
    });

    it('sends components to deploy and delete together', async () => {
      await runCheckout([
        '--metadata-quick-select-components',
        '[{"type":"ApexClass","ids":["Foo"]}]',
        '--metadata-quick-select-components-to-delete',
        '[{"type":"ApexClass","ids":["OldClass"]}]',
        '--destructive-changes-order',
        'pre',
      ]);

      expect(checkoutBody?.metadata).to.deep.equal({
        quickDeploymentComponents: [{ type: 'ApexClass', ids: ['Foo'] }],
        quickDeploymentComponentsToDelete: [{ type: 'ApexClass', ids: ['OldClass'] }],
        destructiveChangesOrder: 'pre',
      });
    });

    it('sends the test level and test classes with only components to delete', async () => {
      await runCheckout([
        '--metadata-quick-select-components-to-delete',
        '[{"type":"ApexClass","ids":["OldClass"]}]',
        '--test-option',
        'RunSpecifiedTests',
        '--apex-test-classes',
        'FooTest, BarTest',
      ]);

      expect(checkoutBody?.metadata).to.deep.equal({
        apexTestClasses: ['FooTest', 'BarTest'],
        quickDeploymentComponentsToDelete: [{ type: 'ApexClass', ids: ['OldClass'] }],
        testLevel: 'RunSpecifiedTests',
      });
    });

    it('does not send an empty list of components to delete', async () => {
      await runCheckout([
        '--metadata-quick-select-components',
        '[{"type":"ApexClass","ids":["Foo"]}]',
        '--metadata-quick-select-components-to-delete',
        '[]',
        '--destructive-changes-order',
        'post',
      ]);

      expect(checkoutBody?.metadata).to.deep.equal({
        quickDeploymentComponents: [{ type: 'ApexClass', ids: ['Foo'] }],
      });
    });

    it('requires a data set or plan when the list of components to delete is empty and nothing else is deployed', async () => {
      let caught: unknown;
      try {
        await runCheckout(['--metadata-quick-select-components-to-delete', '[]']);
      } catch (error) {
        caught = error;
      }
      expect((caught as Error).message).to.equal(prodlyMessages.getMessage('errorNoDatasetAndPlanFlags', []));
      expect(checkoutBody).to.equal(undefined);
    });

    it('names the delete flag when its JSON is invalid', async () => {
      let caught: unknown;
      try {
        await runCheckout(['--metadata-quick-select-components-to-delete', '[{"type":"ApexClass"}]']);
      } catch (error) {
        caught = error;
      }
      expect((caught as Error).message).to.include(
        'Invalid JSON format for metadata-quick-select-components-to-delete flag'
      );
      expect(checkoutBody).to.equal(undefined);
    });
  });
});
