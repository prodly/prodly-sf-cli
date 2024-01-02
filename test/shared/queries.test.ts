import { AuthInfo, Connection, SfError } from '@salesforce/core';
import { expect } from 'chai';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import { getDeploymentEntityId } from '../../src/services/queries.js';


describe('queries service', () => {
  let sandbox: SinonSandbox;
  let hubConnStub: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Stub the Connection class method
    hubConnStub = sandbox.stub(Connection.prototype, 'query');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return deployment entity id when record is found', async () => {
    const recordMock = {
      records: [
        {
          Id: 'testId',
          Name: 'testName',
        },
      ],
    };

    hubConnStub.resolves(recordMock);

    const entityId = await getDeploymentEntityId({
      dataEntityFlag: 'testFlag',
      dataEntityType: 'PDRI__DataSet__c',
      hubConn: new Connection({ authInfo: new AuthInfo() }),
      // eslint-disable-next-line no-console
      print: (text) => console.log(text),
    });

    expect(entityId).to.equal(recordMock.records[0].Id);
    expect(hubConnStub.calledOnce).to.be.true;
  });

  it('should throw an error when no record is found', async () => {
    hubConnStub.resolves({ records: [] });

    try {
      await getDeploymentEntityId({
        dataEntityFlag: 'testFlag',
        dataEntityType: 'PDRI__DataSet__c',
        hubConn: new Connection({ authInfo: new AuthInfo() }),
        // eslint-disable-next-line no-console
        print: (text) => console.log(text),
      });
    } catch (error) {
      expect(error).to.be.instanceOf(SfError);
      expect(hubConnStub.calledOnce).to.be.true;
    }
  });
});