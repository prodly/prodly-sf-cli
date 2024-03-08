import { AuthInfo, Connection } from '@salesforce/core';
import { expect } from 'chai';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import { getManagedInstance, getManagedInstances } from '../../src/services/manage-instances.js';

describe('instances service', () => {
  let sandbox: SinonSandbox;
  let hubConnStub: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Stub the Connection class method
    hubConnStub = sandbox.stub(Connection.prototype, 'request');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should get managed instances', async () => {
    const managedInstancesMock = {
      instances: [
        {
          id: 'testId',
          controlInstance: 'testControlInstance',
          platformInstanceId: 'testPlatformInstanceId',
          connectionId: 'testConnectionId',
        },
      ],
    };

    hubConnStub.resolves(managedInstancesMock);

    const managedInstances = await getManagedInstances({
      hubConn: new Connection({ authInfo: new AuthInfo() }),
      // eslint-disable-next-line no-console
      print: (text) => console.log(text),
    });

    expect(managedInstances).to.deep.equal(managedInstancesMock);
    expect(hubConnStub.calledOnce).to.be.true;
  });

  it('should get a managed instance', async () => {
    const managedInstancesMock = {
      instances: [
        {
          id: 'testId',
          controlInstance: 'testControlInstance',
          platformInstanceId: 'testPlatformInstanceId',
          connectionId: 'testConnectionId',
        },
      ],
    };

    hubConnStub.resolves(managedInstancesMock);

    const managedInstance = await getManagedInstance({
      hubConn: new Connection({ authInfo: new AuthInfo() }),
      // eslint-disable-next-line no-console
      print: (text) => console.log(text),
      orgId: 'testPlatformInstanceId',
    });

    expect(managedInstance).to.deep.equal(managedInstancesMock.instances[0]);
    expect(hubConnStub.calledOnce).to.be.true;
  });
});
