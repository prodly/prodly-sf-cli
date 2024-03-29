import { AuthInfo, Connection, Org } from '@salesforce/core';
import { expect } from 'chai';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import {
  createConnection,
  getConnectionId,
  queryConnection,
  queryConnections,
  updateConnection,
} from '../../src/services/connections.js';

describe('connections service', () => {
  let sandbox: SinonSandbox;
  let hubConnStub: SinonStub;

  let determineIfScratchStub: SinonStub;
  let determineIfSandboxStub: SinonStub;
  let getUsernameStub: SinonStub;
  let getOrgIdStub: SinonStub;
  let getConnectionStub: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Stub the Org methods
    determineIfScratchStub = sandbox.stub(Org.prototype, 'determineIfScratch');
    determineIfSandboxStub = sandbox.stub(Org.prototype, 'determineIfSandbox');
    getUsernameStub = sandbox.stub(Org.prototype, 'getUsername');
    getOrgIdStub = sandbox.stub(Org.prototype, 'getOrgId');
    getConnectionStub = sandbox.stub(Org.prototype, 'getConnection');

    // Stub the Connection and Org class methods
    hubConnStub = sandbox.stub(Connection.prototype, 'query');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create a connection', async () => {
    const connectionMock = {
      // eslint-disable-next-line camelcase
      PDRI__Active__c: true,
      Name: 'testUsername testOrgId',
      // eslint-disable-next-line camelcase
      PDRI__OrganizationId__c: 'testOrgId',
      // eslint-disable-next-line camelcase
      PDRI__Access_Token__c: 'testAccessToken',
      // eslint-disable-next-line camelcase
      PDRI__Org_Type__c: 'Production',
      // eslint-disable-next-line camelcase
      PDRI__Instance_URL__c: 'testInstanceUrl',
      // eslint-disable-next-line camelcase
      PDRI__User_Id__c: 'testUserId',
      // eslint-disable-next-line camelcase
      PDRI__Username__c: 'testUsername',
    };

    determineIfScratchStub.resolves(false);
    determineIfSandboxStub.resolves(false);
    getUsernameStub.returns('testUsername');
    getOrgIdStub.returns('testOrgId');
    getConnectionStub.returns({
      getConnectionOptions: () => ({
        accessToken: 'testAccessToken',
        instanceUrl: 'testInstanceUrl/',
        userId: 'testUserId',
      }),
    });

    hubConnStub.resolves({ id: 'testId' });

    const createStub = sandbox.stub(Connection.prototype, 'create');
    createStub.resolves({ success: true, id: 'testId', errors: [] });

    const connectionId = await createConnection({
      name: undefined,
      org: new Org(),
      hubConn: new Connection({ authInfo: new AuthInfo() }),
    });

    expect(connectionId).to.equal('testId');
    expect(createStub.calledOnceWith('PDRI__Connection__c', connectionMock)).to.be.true;
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
