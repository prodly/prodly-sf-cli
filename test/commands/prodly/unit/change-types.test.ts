import { Messages, SfError } from '@salesforce/core';
import { TestContext } from '@salesforce/core/testSetup';
import { expect } from 'chai';
import ProdlyChangeTypes from '../../../../src/commands/prodly/change-types.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);

describe('prodly:change-types', () => {
  const $$ = new TestContext();

  afterEach(() => {
    $$.restore();
  });

  it('should throw an error when target dev hub is not provided', async () => {
    try {
      await ProdlyChangeTypes.run([]);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include('No default dev hub found');
      }
    }
  });

  it('should throw an error when create or list flags are not provided.', async () => {
    try {
      await ProdlyChangeTypes.run(['--target-dev-hub', 'test']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include('Must provide either --create or --list flag');
      }
    }
  });

  it('should throw an error when both create and list flags are provided.', async () => {
    try {
      await ProdlyChangeTypes.run(['--target-dev-hub', 'test', '--create', '--list']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include('Cannot use --create and --list flags together');
      }
    }
  });

  it('should throw an error when create flag is provided but name username or id are not provided', async () => {
    try {
      await ProdlyChangeTypes.run(['--target-dev-hub', 'test', '--create', '--id', 'test']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include('Must provide --name, --username, and --id flags when using --create');
      }
    }
  });
});
