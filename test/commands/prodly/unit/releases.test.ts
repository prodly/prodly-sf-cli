import { SfError } from '@salesforce/core';
import { TestContext } from '@salesforce/core/testSetup';
import { expect } from 'chai';
import ProdlyReleases from '../../../../src/commands/prodly/releases.js';

describe('prodly:releases', () => {
  const $$ = new TestContext();

  afterEach(() => {
    $$.restore();
  });

  it('should throw an error when target dev hub is not provided', async () => {
    try {
      await ProdlyReleases.run([]);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include('No default dev hub found');
      }
    }
  });

  it('should throw an error when deploy or list flags are not provided.', async () => {
    try {
      await ProdlyReleases.run(['--target-dev-hub', 'test']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include('Exactly one of the following must be provided: --deploy');
        expect(error.message).to.include('Exactly one of the following must be provided: --list');
      }
    }
  });

  it('should throw an error when both deploy and list flags are provided.', async () => {
    try {
      await ProdlyReleases.run(['--target-dev-hub', 'test', '--deploy', '--list']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include('--deploy cannot also be provided when using --list');
        expect(error.message).to.include('--deploy=true cannot also be provided when using --list');
        expect(error.message).to.include('--list cannot also be provided when using --deploy');
        expect(error.message).to.include(
          'All of the following must be provided when using --deploy: --instance, --release-id'
        );
      }
    }
  });

  it('should throw an error when deploy flag is provided but release-id, username or instance are not provided', async () => {
    try {
      await ProdlyReleases.run(['--target-dev-hub', 'test', '--deploy']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include(
          'All of the following must be provided when using --deploy: --instance, --release-id'
        );
      }
    }
  });
});
