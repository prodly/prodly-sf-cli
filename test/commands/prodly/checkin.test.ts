import { SfError } from '@salesforce/core';
import { TestContext } from '@salesforce/core/lib/testSetup.js';
import { expect } from 'chai';
import ProdlyCheckin from '../../../src/commands/prodly/checkin.js';

describe('prodly:checkin', () => {
  const $$ = new TestContext();
  // let sfCommandStubs: ReturnType<typeof stubSfCommandUx>;

  // beforeEach(() => {
  //   sfCommandStubs = stubSfCommandUx($$.SANDBOX);
  // });

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
});
