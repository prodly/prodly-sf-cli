import { execCmd } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';
import * as CONST from './utilities/constants.js';

describe('CLI checkin commands automation', () => {
  // 1. Check-in With all the correct Flag
  it('1. Check-In commands with all the flags', () => {
    const rv = execCmd(
      `prodly:checkin -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONST.BRANCH_MAIN}' -t '${CONST.DATASET_NAME}' -c '${CONST.COMMIT_MESSAGE}${CONST.CHECK_IN_COMMIT_1}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONST.CHECKIN_LAUNCHED);
  });
  // 2. Check-in without Instance flag 
  it('2. Check-In commands without instance flag', () => {
    const rv = execCmd(
      `prodly:checkin -b '${CONST.BRANCH_MAIN}' -t '${CONST.DATASET_NAME}' -c '${CONST.COMMIT_MESSAGE}${CONST.CHECK_IN_COMMIT_2}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONST.CHECKIN_LAUNCHED);
  });
  //3. Check-in With all the correct Flag
  it('3. Check-In commands without branch flag', () => {
    const rv = execCmd(
      `prodly:checkin -i '${process.env.CONTROL_MANAGE_ID}' -t '${CONST.DATASET_NAME}' -c '${CONST.COMMIT_MESSAGE}${CONST.CHECK_IN_COMMIT_3}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONST.CHECKIN_LAUNCHED);
  });
  // 4. Check-in Without dataset flag
  it('4. Check-In commands Without dataset flag', () => {
    const rv = execCmd(
      `prodly:checkin -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONST.BRANCH_MAIN}' -c '${CONST.COMMIT_MESSAGE}${CONST.CHECK_IN_COMMIT_4}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string(CONST.ERROR_DATASET_PLAN_FLAG_MISSING);
    expect(response.context).to.be.string(CONST.CMD_LABEL_CHECKIN);
    expect(response.commandName).to.be.string(CONST.CMD_LABEL_CHECKIN);
    expect(response.name).to.be.string(CONST.SF_ERROR_LABEL);
    expect(response.stack).to.exist;
  });
  // 5. Check-in with the dataset flag having wrong value
  it('5. Check-In commands with dataset flag having wrong value', () => {
    const rv = execCmd(
      `prodly:checkin -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONST.BRANCH_MAIN}' -t '${CONST.INVALID_DATASET_NAME}' -c '${CONST.COMMIT_MESSAGE}${CONST.CHECK_IN_COMMIT_5}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string(CONST.ERROR_INVALID_DATASET_VALUE);
    expect(response.context).to.be.string(CONST.CMD_LABEL_CHECKIN);
    expect(response.commandName).to.be.string(CONST.CMD_LABEL_CHECKIN);
    expect(response.name).to.be.string(CONST.SF_ERROR_LABEL);
    expect(response.stack).to.exist;
  });
  // 6. Check-in with flexible branch
  it('6. Check-In commands with flexible branch', () => {
    const rv = execCmd(
      `prodly:checkin -i '${process.env.CONTROL_MANAGE_ID}' -b 'S3' -t ${CONST.DATASET_NAME} -c '${CONST.COMMIT_MESSAGE}${CONST.CHECK_IN_COMMIT_6}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONST.CHECKIN_LAUNCHED);
  });
  // 7. Check-in with plan flag but invalid value
  it('7. Check-In commands with plan flag but invalid value', () => {
    const rv = execCmd(
      `prodly:checkin -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONST.BRANCH_MAIN}' -p '${CONST.INVALID_PLAN_NAME}' -c '${CONST.COMMIT_MESSAGE}${CONST.CHECK_IN_COMMIT_7}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string(CONST.ERROR_INVALID_PLAN_VALUE);
    expect(response.context).to.be.string(CONST.CMD_LABEL_CHECKIN);
    expect(response.commandName).to.be.string(CONST.CMD_LABEL_CHECKIN);
    expect(response.name).to.be.string(CONST.SF_ERROR_LABEL);
    expect(response.stack).to.exist;
  });
  // 8. Check-in with plan flag and notes flag
  it('8. Check-In commands with plan flag and notes flag', () => {
    const rv = execCmd(
      `prodly:checkin -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONST.BRANCH_MAIN}' -p ${CONST.PLAN_NAME} -c '${CONST.COMMIT_MESSAGE}${CONST.CHECK_IN_COMMIT_8}' -z '${CONST.DEPLOYMENT_NOTE_TEXT}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONST.CHECKIN_LAUNCHED);
  });
  // 9. Check-in Without comment flag
  it('9. Check-In commands without comment flag', () => {
    const rv = execCmd(
      `prodly:checkin -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONST.BRANCH_MAIN}' -p ${CONST.PLAN_NAME} -z '${CONST.DEPLOYMENT_NOTE_TEXT}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.contain(CONST.ERROR_COMMIT_FLAG_MISSING);
    expect(response.context).to.be.string(CONST.CMD_LABEL_CHECKIN);
    expect(response.commandName).to.be.string(CONST.CMD_LABEL_CHECKIN);
    expect(response.name).to.be.string(CONST.ERROR);
    expect(response.stack).to.exist;
  });
   // 10. Check-in with query filter
   it('10. Check-In commands with query filter flag', () => {
    const rv = execCmd(
      `prodly:checkin -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONST.BRANCH_MAIN}' -q '${CONST.QUERY}' -t '${CONST.DATASET_NAME}' -c '${CONST.COMMIT_MESSAGE}${CONST.CHECK_IN_COMMIT_10}' -z '${CONST.DEPLOYMENT_NOTE_TEXT}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    console.log(response);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONST.CHECKIN_LAUNCHED);
  });
  // 11. Check-in with query filter having invalid query as value
  it('11. Check-In commands with query filter flag having invalid query as value', () => {
    const rv = execCmd(
      `prodly:checkin -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONST.BRANCH_MAIN}' -q '${CONST.INVALID_QUERY}' -t '${CONST.DATASET_NAME}' -c '${CONST.COMMIT_MESSAGE}${CONST.CHECK_IN_COMMIT_11}' -z '${CONST.DEPLOYMENT_NOTE_TEXT}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    console.log(response);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONST.CHECKIN_LAUNCHED);
  });
});