import { Messages, SfError } from '@salesforce/core';
import { TestContext } from '@salesforce/core/lib/testSetup.js';
import { expect } from 'chai';
import ProdlyDeploy from '../../../../src/commands/prodly/deploy.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const prodlyMessages = Messages.loadMessages('prodlysfcli', 'prodly');

describe('prodly:deploy', () => {
  const $$ = new TestContext();

  afterEach(() => {
    $$.restore();
  });

  it('should throw an error when target dev hub is not provided', async () => {
    try {
      await ProdlyDeploy.run(['--target-org', 'test']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include('No default dev hub found');
      }
    }
  });

  it('should throw an error when target org is not provided', async () => {
    try {
      await ProdlyDeploy.run(['--target-dev-hub', 'test']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include('No default environment found');
      }
    }
  });

  it('should throw an error when data set or deployment flags are not provided.', async () => {
    try {
      await ProdlyDeploy.run(['--target-org', 'test', '--target-dev-hub', 'test']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include(prodlyMessages.getMessage('errorNoDatasetAndPlanFlags', []));
      }
    }
  });

  it('should throw an error when both data set and deployment flags are provided.', async () => {
    try {
      await ProdlyDeploy.run(['--target-org', 'test', '--target-dev-hub', 'test', '-t', 'test', '-p', 'test']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include(prodlyMessages.getMessage('errorDatasetAndPlanFlags', []));
      }
    }
  });

  it('should throw an error when query filter flag is provided without a dataset flag', async () => {
    try {
      await ProdlyDeploy.run([
        '--target-org',
        'test',
        '--target-dev-hub',
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
});
