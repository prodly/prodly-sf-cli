import { Messages, SfError } from '@salesforce/core';
import { TestContext } from '@salesforce/core/testSetup';
import { expect } from 'chai';
import ProdlyBranchFolders from '../../../../src/commands/prodly/branch-folders.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);

describe('prodly:branch-folders', () => {
  const $$ = new TestContext();

  afterEach(() => {
    $$.restore();
  });

  it('should throw an error when target dev hub is not provided', async () => {
    try {
      await ProdlyBranchFolders.run([]);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include('No default dev hub found');
      }
    }
  });

  it('should throw an error when list flag is not provided.', async () => {
    try {
      await ProdlyBranchFolders.run(['--target-dev-hub', 'test']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include('Missing required flag list');
      }
    }
  });
});
