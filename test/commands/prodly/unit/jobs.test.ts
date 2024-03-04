import { Messages, SfError } from '@salesforce/core';
import { TestContext } from '@salesforce/core/lib/testSetup.js';
import { expect } from 'chai';
import ProdlyJobs from '../../../../src/commands/prodly/jobs.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);

describe('prodly:jobs', () => {
  const $$ = new TestContext();

  afterEach(() => {
    $$.restore();
  });

  it('should throw an error when target dev hub is not provided', async () => {
    try {
      await ProdlyJobs.run(['--target-org', 'test']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include('No default dev hub found');
      }
    }
  });

  it('should throw an error when Job Id flag is not provided.', async () => {
    try {
      await ProdlyJobs.run(['--target-dev-hub', 'test']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include('Missing required flag job');
      }
    }
  });
});
