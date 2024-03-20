import { execCmd } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';
import * as CONSTANTS from './utilities/constants.js';

describe('CLI checkin commands automation', () => {
  // 1. Check-in with all the correct flags
  it('1. Check-In commands with all the flags', () => {
    const rv = execCmd(
      `prodly:checkin -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONSTANTS.BRANCH_MAIN}' -t '${CONSTANTS.DATASET_NAME}' -c '${CONSTANTS.COMMIT_MESSAGE}${CONSTANTS.CHECK_IN_COMMIT_1}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONSTANTS.CHECKIN_LAUNCHED);
  });
  // 2. Check-in without instance flag 
  it('2. Check-In commands without instance flag', () => {
    const rv = execCmd(
      `prodly:checkin -b '${CONSTANTS.BRANCH_MAIN}' -t '${CONSTANTS.DATASET_NAME}' -c '${CONSTANTS.COMMIT_MESSAGE}${CONSTANTS.CHECK_IN_COMMIT_2}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONSTANTS.CHECKIN_LAUNCHED);
  });
  //3. Check-in without branch flag
  it('3. Check-In commands without branch flag', () => {
    const rv = execCmd(
      `prodly:checkin -i '${process.env.CONTROL_MANAGE_ID}' -t '${CONSTANTS.DATASET_NAME}' -c '${CONSTANTS.COMMIT_MESSAGE}${CONSTANTS.CHECK_IN_COMMIT_3}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONSTANTS.CHECKIN_LAUNCHED);
  });
  // 4. Check-in wthout dataset flag
  it('4. Check-In commands without dataset flag', () => {
    const rv = execCmd(
      `prodly:checkin -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONSTANTS.BRANCH_MAIN}' -c '${CONSTANTS.COMMIT_MESSAGE}${CONSTANTS.CHECK_IN_COMMIT_4}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string(CONSTANTS.ERROR_DATASET_PLAN_FLAG_MISSING);
    expect(response.context).to.be.string(CONSTANTS.CMD_LABEL_CHECKIN);
    expect(response.commandName).to.be.string(CONSTANTS.CMD_LABEL_CHECKIN);
    expect(response.name).to.be.string(CONSTANTS.SF_ERROR_LABEL);
    expect(response.stack).to.exist;
  });
  // 5. Check-in with the dataset flag having wrong value
  it('5. Check-In commands with dataset flag having wrong value', () => {
    const rv = execCmd(
      `prodly:checkin -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONSTANTS.BRANCH_MAIN}' -t '${CONSTANTS.INVALID_DATASET_NAME}' -c '${CONSTANTS.COMMIT_MESSAGE}${CONSTANTS.CHECK_IN_COMMIT_5}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string(CONSTANTS.ERROR_INVALID_DATASET_VALUE);
    expect(response.context).to.be.string(CONSTANTS.CMD_LABEL_CHECKIN);
    expect(response.commandName).to.be.string(CONSTANTS.CMD_LABEL_CHECKIN);
    expect(response.name).to.be.string(CONSTANTS.SF_ERROR_LABEL);
    expect(response.stack).to.exist;
  });
  // 6. Check-in with flexible branch
  it('6. Check-In commands with flexible branch', () => {
    const rv = execCmd(
      `prodly:checkin -i '${process.env.CONTROL_MANAGE_ID}' -b 'S3' -t ${CONSTANTS.DATASET_NAME} -c '${CONSTANTS.COMMIT_MESSAGE}${CONSTANTS.CHECK_IN_COMMIT_6}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONSTANTS.CHECKIN_LAUNCHED);
  });
  // 7. Check-in with plan flag but invalid value
  it('7. Check-In commands with plan flag but invalid value', () => {
    const rv = execCmd(
      `prodly:checkin -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONSTANTS.BRANCH_MAIN}' -p '${CONSTANTS.INVALID_PLAN_NAME}' -c '${CONSTANTS.COMMIT_MESSAGE}${CONSTANTS.CHECK_IN_COMMIT_7}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string(CONSTANTS.ERROR_INVALID_PLAN_VALUE);
    expect(response.context).to.be.string(CONSTANTS.CMD_LABEL_CHECKIN);
    expect(response.commandName).to.be.string(CONSTANTS.CMD_LABEL_CHECKIN);
    expect(response.name).to.be.string(CONSTANTS.SF_ERROR_LABEL);
    expect(response.stack).to.exist;
  });
  // 8. Check-in with plan flag and notes flag
  it('8. Check-In commands with plan flag and notes flag', () => {
    const rv = execCmd(
      `prodly:checkin -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONSTANTS.BRANCH_MAIN}' -p ${CONSTANTS.PLAN_NAME} -c '${CONSTANTS.COMMIT_MESSAGE}${CONSTANTS.CHECK_IN_COMMIT_8}' -z '${CONSTANTS.DEPLOYMENT_NOTE_TEXT}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONSTANTS.CHECKIN_LAUNCHED);
  });
  // 9. Check-in without comment flag
  it('9. Check-In commands without comment flag', () => {
    const rv = execCmd(
      `prodly:checkin -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONSTANTS.BRANCH_MAIN}' -p ${CONSTANTS.PLAN_NAME} -z '${CONSTANTS.DEPLOYMENT_NOTE_TEXT}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.contain(CONSTANTS.ERROR_COMMIT_FLAG_MISSING);
    expect(response.context).to.be.string(CONSTANTS.CMD_LABEL_CHECKIN);
    expect(response.commandName).to.be.string(CONSTANTS.CMD_LABEL_CHECKIN);
    expect(response.name).to.be.string(CONSTANTS.ERROR);
    expect(response.stack).to.exist;
  });
   // 10. Check-in with query filter
   it('10. Check-In commands with query filter flag', () => {
    const rv = execCmd(
      `prodly:checkin -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONSTANTS.BRANCH_MAIN}' -q '${CONSTANTS.QUERY}' -t '${CONSTANTS.DATASET_NAME}' -c '${CONSTANTS.COMMIT_MESSAGE}${CONSTANTS.CHECK_IN_COMMIT_10}' -z '${CONSTANTS.DEPLOYMENT_NOTE_TEXT}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONSTANTS.CHECKIN_LAUNCHED);
  });
  // 11. Check-in with query filter having invalid query as value
  it('11. Check-In commands with query filter flag having invalid query as value', () => {
    const rv = execCmd(
      `prodly:checkin -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONSTANTS.BRANCH_MAIN}' -q '${CONSTANTS.INVALID_QUERY}' -t '${CONSTANTS.DATASET_NAME}' -c '${CONSTANTS.COMMIT_MESSAGE}${CONSTANTS.CHECK_IN_COMMIT_11}' -z '${CONSTANTS.DEPLOYMENT_NOTE_TEXT}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONSTANTS.CHECKIN_LAUNCHED);
  });
});