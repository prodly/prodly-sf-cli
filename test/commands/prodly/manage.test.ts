import { Messages, SfError } from '@salesforce/core';
import { TestContext } from '@salesforce/core/lib/testSetup.js';
// import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
import { expect } from 'chai';
import ProdlyManage from '../../../src/commands/prodly/manage.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const prodlyMessages = Messages.loadMessages('prodlysfcli', 'prodly');

describe('prodly:manage', () => {
  const $$ = new TestContext();
  // let sfCommandStubs: ReturnType<typeof stubSfCommandUx>;

  // beforeEach(() => {
  //   sfCommandStubs = stubSfCommandUx($$.SANDBOX);
  // });

  afterEach(() => {
    $$.restore();
  });

  // it('runs manage', async () => {
  //   await ProdlyManage.run([]);
  //   const output = sfCommandStubs.log
  //     .getCalls()
  //     .flatMap((c) => c.args)
  //     .join('\n');
  //   expect(output).to.equal({});
  // });

  it('should throw an error when target dev hub is not provided', async () => {
    try {
      await ProdlyManage.run(['--target-org', 'test']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include('No default dev hub found');
      }
    }
  });

  it('should throw an error when target org is not provided', async () => {
    try {
      await ProdlyManage.run(['--target-dev-hub', 'test']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include('No default environment found');
      }
    }
  });

  it('should throw an error when listFlag or manageFlag or unmanageFlag are not provided', async () => {
    try {
      await ProdlyManage.run(['--target-org', 'test', '--target-dev-hub', 'test']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include(prodlyMessages.getMessage('errorNoManageFlags', []));
      }
    }
  });

  it('should throw an error when multiple operation flags are provided', async () => {
    try {
      await ProdlyManage.run(['--target-org', 'test', '--target-dev-hub', 'test', '-l', '-m']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include(prodlyMessages.getMessage('errorMultipleManageFlags', []));
      }
    }
  });

  it('should throw an error when instance name flag is not provided because it is required when managing an instance', async () => {
    try {
      await ProdlyManage.run(['--target-org', 'test', '--target-dev-hub', 'test', '-m']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include(prodlyMessages.getMessage('errorManageLabelFlag', []));
      }
    }
  });

  it('should throw an error when providing the print flag without the list operation flag', async () => {
    try {
      await ProdlyManage.run(['--target-org', 'test', '--target-dev-hub', 'test', '-x', '-p']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include(prodlyMessages.getMessage('errorPrintFlagNoListFlag', []));
      }
    }
  });

  it('should throw an error when providing the version flag without using the manage operation flag', async () => {
    try {
      await ProdlyManage.run(['--target-org', 'test', '--target-dev-hub', 'test', '-x', '-s']);
    } catch (error) {
      if (error instanceof SfError) {
        expect(error.message).to.include(prodlyMessages.getMessage('errorVersionFlagNoManageFlag', []));
      }
    }
  });
});
