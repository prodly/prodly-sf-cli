import { AuthInfo, Connection, Org } from '@salesforce/core';
import { expect } from 'chai';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import {
  getConnectionId,
  queryConnection,
  queryConnections,
  updateConnection,
} from '../../src/services/connections.js';

describe('connections service', () => {
  let sandbox: SinonSandbox;
  let hubConnStub: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Stub the Connection and Org class methods
    hubConnStub = sandbox.stub(Connection.prototype, 'query');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should get a connection id', async () => {
    hubConnStub.resolves({ records: [{ Id: 'testId' }] });

    const connectionId = await getConnectionId({
      hubConn: new Connection({ authInfo: new AuthInfo() }),
      orgId: 'testOrgId',
      // eslint-disable-next-line no-console
      print: (text) => console.log(text),
    });

    expect(connectionId).to.equal('testId');
    expect(hubConnStub.calledOnce).to.be.true;
  });

  it('should query a connection', async () => {
    // eslint-disable-next-line camelcase
    hubConnStub.resolves({ records: [{ Id: 'testId', Name: 'testName', PDRI__OrganizationId__c: 'testOrgId' }] });

    const connection = await queryConnection({
      connectionNameOrId: 'testId',
      hubConn: new Connection({ authInfo: new AuthInfo() }),
      // eslint-disable-next-line no-console
      print: (text) => console.log(text),
    });

    expect(connection.Id).to.equal('testId');
    expect(connection.Name).to.equal('testName');
    expect(connection.PDRI__OrganizationId__c).to.equal('testOrgId');
    expect(hubConnStub.calledOnce).to.be.true;
  });

  it('should query connections', async () => {
    // eslint-disable-next-line camelcase
    hubConnStub.resolves({ records: [{ Id: 'testId', Name: 'testName', PDRI__Instance_URL__c: 'testInstanceUrl' }] });

    const connections = await queryConnections({
      connectionIds: ['testId'],
      hubConn: new Connection({ authInfo: new AuthInfo() }),
      // eslint-disable-next-line no-console
      print: (text) => console.log(text),
    });

    const connection = connections.get('testId')!;
    expect(connection.Id).to.equal('testId');
    expect(connection.Name).to.equal('testName');
    expect(connection.PDRI__Instance_URL__c).to.equal('testInstanceUrl');
    expect(hubConnStub.calledOnce).to.be.true;
  });

  it('should update a connection', async () => {
    const updateStub = sandbox.stub(Connection.prototype, 'update');
    updateStub.resolves({ success: true, id: 'testId', errors: [] });

    const connectionId = await updateConnection({
      connectionId: 'testId',
      hubConn: new Connection({ authInfo: new AuthInfo() }),
      org: new Org(),
    });

    expect(connectionId.id).to.equal('testId');
    expect(updateStub.calledOnce).to.be.true;
  });
});
