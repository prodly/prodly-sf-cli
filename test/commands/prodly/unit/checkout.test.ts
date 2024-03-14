import { Messages, SfError } from '@salesforce/core';
import { TestContext } from '@salesforce/core/lib/testSetup.js';
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
});
