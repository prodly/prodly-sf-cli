import { execCmd } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';
import * as CONSTANTS from './utilities/constants.js';

describe('CLI jobs commands automation', () => {
  // Job command without value.
  it('1. Search for jobs using job flag but without value', () => {
    const rv = execCmd(
      `prodly:jobs -j --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string(CONSTANTS.ERROR_JOB_FLAG_REQUIRED);
    expect(response.context).to.be.string(CONSTANTS.CMD_LABEL_JOBS);
    expect(response.commandName).to.be.string(CONSTANTS.CMD_LABEL_JOBS);
    expect(response.name).to.be.string(CONSTANTS.ERROR);
    expect(response.stack).to.exist;
  });
  // Job command with value
  it('2. Search for a job using job flag with value', () => {
    const rv = execCmd(
      `prodly:jobs -j '${process.env.JOB_ID}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.job.status).to.be.string(CONSTANTS.COMPLETED);
  });
  // Job command with invalid value
  it('3. Search for a job with job flag but with invalid value', () => {
    const rv = execCmd(

      `prodly:jobs -j "${CONSTANTS.INVALID_JOB_ID}" --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.contain(CONSTANTS.ERROR_REQUEST_NOT_FOUND);
    expect(response.context).to.be.string(CONSTANTS.CMD_LABEL_JOBS);
    expect(response.commandName).to.be.string(CONSTANTS.CMD_LABEL_JOBS);
    expect(response.name).to.be.string(CONSTANTS.ERROR_404);
    expect(response.stack).to.exist;
  });
});