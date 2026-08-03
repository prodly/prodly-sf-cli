import { AuthInfo, Connection, SfError } from '@salesforce/core';
import { expect } from 'chai';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import { getManagedInstances } from '../../src/services/manage-instances.js';
import { formatJsforceError } from '../../src/utils/formatJsforceError.js';

describe('formatJsforceError', () => {
  it('returns error.message when non-blank', () => {
    const error = new Error('Connection timeout');
    expect(formatJsforceError(error)).to.equal('Connection timeout');
  });

  it('uses Salesforce-shaped error.data when message is blank', () => {
    const error = Object.assign(new Error(''), {
      data: [{ message: 'Insufficient access', errorCode: 'INSUFFICIENT_ACCESS' }],
    });
    expect(formatJsforceError(error)).to.include('Insufficient access');
  });

  it('uses plain-text response body when message is blank', () => {
    const error = Object.assign(new Error(''), {
      response: { statusCode: 502, body: 'Bad Gateway' },
    });
    const formatted = formatJsforceError(error);
    expect(formatted).to.not.match(/^\s*$/);
    expect(formatted).to.include('Bad Gateway');
  });

  it('uses non-SF JSON body when message is blank', () => {
    const error = Object.assign(new Error('   '), {
      data: { detail: 'upstream timeout', code: 'PROXY_ERROR' },
    });
    const formatted = formatJsforceError(error);
    expect(formatted).to.not.match(/^\s*$/);
    expect(formatted).to.include('upstream timeout');
  });

  it('falls back to Request failed with status when nothing else is available', () => {
    const error = Object.assign(new Error(''), {
      errorCode: 'ERROR_HTTP_502',
      statusCode: 502,
    });
    const formatted = formatJsforceError(error);
    expect(formatted).to.include('Request failed');
    expect(formatted).to.match(/502|ERROR_HTTP_502/);
  });
});

describe('getManagedInstances error surfacing', () => {
  let sandbox: SinonSandbox;
  let hubConnStub: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    hubConnStub = sandbox.stub(Connection.prototype, 'request');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('throws SfError with non-empty message including plain-text body when jsforce message is blank', async () => {
    const jsforceError = Object.assign(new Error(''), {
      response: { statusCode: 502, body: 'Bad Gateway from AppOps proxy' },
    });
    hubConnStub.rejects(jsforceError);

    try {
      await getManagedInstances({
        hubConn: new Connection({ authInfo: new AuthInfo() }),
      });
      expect.fail('Expected getManagedInstances to throw');
    } catch (err) {
      expect(err).to.be.instanceOf(SfError);
      const message = (err as SfError).message;
      expect(message).to.be.a('string').that.is.not.empty;
      expect(message).to.include('Bad Gateway from AppOps proxy');
    }
  });
});
