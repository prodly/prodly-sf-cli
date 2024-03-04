import { AuthInfo, Connection } from '@salesforce/core';
import { expect } from 'chai';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import { jobCompletion } from '../../src/services/jobs.js';

describe('jobs service', () => {
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

  it('should return job when job status is COMPLETED', async () => {
    const jobMock = {
      jobs: [
        {
          status: 'COMPLETED',
          // other properties...
        },
      ],
    };

    hubConnStub.resolves(JSON.stringify(jobMock));

    const job = await jobCompletion({
      hubConn: new Connection({ authInfo: new AuthInfo() }),
      // eslint-disable-next-line no-console
      print: (text) => console.log(text),
      jobId: 'testId',
    });

    expect(job).to.deep.equal(jobMock.jobs[0]);
    expect(hubConnStub.calledOnce).to.be.true;
  });

  it('should return undefined when job status is not COMPLETED', async () => {
    const jobMock = {
      jobs: [
        {
          status: 'NOT_COMPLETED',
          // other properties...
        },
      ],
    };

    hubConnStub.resolves(JSON.stringify(jobMock));

    const job = await jobCompletion({
      hubConn: new Connection({ authInfo: new AuthInfo() }),
      // eslint-disable-next-line no-console
      print: (text) => console.log(text),
      jobId: 'testId',
    });

    expect(job).to.be.undefined;
    expect(hubConnStub.calledOnce).to.be.true;
  });
});
