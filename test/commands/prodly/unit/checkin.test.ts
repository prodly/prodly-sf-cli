import { Messages, SfError } from '@salesforce/core';
import { TestContext } from '@salesforce/core/testSetup';
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
});
