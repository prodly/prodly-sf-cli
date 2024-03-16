import { execCmd } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';
import * as CONST from './utilities/constants.js';

describe('CLI jobs commands automation', () => {
  // Job command without value.
  it('1. Search for jobs using job flag but without value', () => {
    const rv = execCmd(
      `prodly:jobs -j --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string(CONST.ERROR_JOB_FLAG_REQUIRED);
    expect(response.context).to.be.string(CONST.CMD_LABEL_JOBS);
    expect(response.commandName).to.be.string(CONST.CMD_LABEL_JOBS);
    expect(response.name).to.be.string(CONST.ERROR);
    expect(response.stack).to.exist;
  });
  // Job command with value
  it('2. Search for a job using job flag with value', () => {
    const rv = execCmd(
      `prodly:jobs -j '${process.env.JOB_ID}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.job.status).to.be.string(CONST.COMPLETED);
  });
  // Job command with invalid value
  it('3. Search for a job with job flag but with invalid value', () => {
    const rv = execCmd(

      `prodly:jobs -j "${CONST.INVALID_JOB_ID}" --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.contain(CONST.ERROR_REQUEST_NOT_FOUND);
    expect(response.context).to.be.string(CONST.CMD_LABEL_JOBS);
    expect(response.commandName).to.be.string(CONST.CMD_LABEL_JOBS);
    expect(response.name).to.be.string(CONST.ERROR_404);
    expect(response.stack).to.exist;
  });
});