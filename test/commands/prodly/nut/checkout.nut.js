import { execCmd } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';
import * as CONSTANTS from './utilities/constants.js';

describe('CLI checkout commands automation', () => {
  // 1. Check-Out with all the correct Flag
  it('1. Check-Out commands with all the flags', () => {
    const rv = execCmd(
      `prodly:checkout -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONSTANTS.BRANCH_MAIN}' -t '${CONSTANTS.DATASET_NAME}' -n '${CONSTANTS.CHECKOUT_DEPLOYMENT_NAME}${CONSTANTS.CHECK_OUT_MESSAGE_1}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONSTANTS.CHECKOUT_LAUNCHED);
  });
  // 2. Check-Out without instance flag 
  it('2. Check-Out commands without instance flag', () => {
    const rv = execCmd(
      `prodly:checkout -b '${CONSTANTS.BRANCH_MAIN}' -t '${CONSTANTS.DATASET_NAME}' -n '${CONSTANTS.CHECKOUT_DEPLOYMENT_NAME}${CONSTANTS.CHECK_OUT_MESSAGE_2}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONSTANTS.CHECKOUT_LAUNCHED);
  });
  //3. Check-Out with all the correct Flag
  it('3. Check-Out commands without branch flag', () => {
    const rv = execCmd(
      `prodly:checkout -i '${process.env.CONTROL_MANAGE_ID}' -t '${CONSTANTS.DATASET_NAME}' -n '${CONSTANTS.CHECKOUT_DEPLOYMENT_NAME}${CONSTANTS.CHECK_OUT_MESSAGE_3}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONSTANTS.CHECKOUT_LAUNCHED);
  });
  // 4. Check-Out without dataset flag
  it('4. Check-Out commands without dataset flag with name flag', () => {
    const rv = execCmd(
      `prodly:checkout -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONSTANTS.BRANCH_MAIN}' -n '${CONSTANTS.CHECKOUT_DEPLOYMENT_NAME}${CONSTANTS.CHECK_OUT_MESSAGE_4}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string(CONSTANTS.ERROR_DATASET_PLAN_FLAG_MISSING);
    expect(response.context).to.be.string(CONSTANTS.CMD_LABEL_CHECKOUT);
    expect(response.commandName).to.be.string(CONSTANTS.CMD_LABEL_CHECKOUT);
    expect(response.name).to.be.string(CONSTANTS.SF_ERROR_LABEL);
    expect(response.stack).to.exist;
  });
  // 5. Check-Out with the dataset flag having wrong value
  it('5. Check-Out commands with the dataset flag having wrong value', () => {
    const rv = execCmd(
      `prodly:checkout -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONSTANTS.BRANCH_MAIN}' -t '${CONSTANTS.INVALID_DATASET_NAME}' -n '${CONSTANTS.CHECKOUT_DEPLOYMENT_NAME}${CONSTANTS.CHECK_OUT_MESSAGE_5}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string(CONSTANTS.ERROR_INVALID_DATASET_VALUE);
    expect(response.context).to.be.string(CONSTANTS.CMD_LABEL_CHECKOUT);
    expect(response.commandName).to.be.string(CONSTANTS.CMD_LABEL_CHECKOUT);
    expect(response.name).to.be.string(CONSTANTS.SF_ERROR_LABEL);
    expect(response.stack).to.exist;
  });
  // 6. Check-Out with flexible branch
  it('6. Check-Out commands with flexible branch', () => {
    const rv = execCmd(
      `prodly:checkout -i '${process.env.CONTROL_MANAGE_ID}' -b 'S3' -t '${CONSTANTS.DATASET_NAME}' -n '${CONSTANTS.CHECKOUT_DEPLOYMENT_NAME}${CONSTANTS.CHECK_OUT_MESSAGE_6}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONSTANTS.CHECKOUT_LAUNCHED);
  });
  // 7. Check-Out with plan flag but invalid value
  it('7. Check-Out commands with plan flag but invalid value', () => {
    const rv = execCmd(
      `prodly:checkout -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONSTANTS.BRANCH_MAIN}' -p '${CONSTANTS.INVALID_PLAN_NAME}' -n '${CONSTANTS.CHECKOUT_DEPLOYMENT_NAME}${CONSTANTS.CHECK_OUT_MESSAGE_7}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string(CONSTANTS.ERROR_INVALID_PLAN_VALUE);
    expect(response.context).to.be.string(CONSTANTS.CMD_LABEL_CHECKOUT);
    expect(response.commandName).to.be.string(CONSTANTS.CMD_LABEL_CHECKOUT);
    expect(response.name).to.be.string(CONSTANTS.SF_ERROR_LABEL);
    expect(response.stack).to.exist;
  });
  // 8. Check-Out with plan flag and notes flag
  it('8. Check-Out commands with plan flag and notes flag', () => {
    const rv = execCmd(
      `prodly:checkout -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONSTANTS.BRANCH_MAIN}' -p '${CONSTANTS.PLAN_NAME}' -n '${CONSTANTS.CHECKOUT_DEPLOYMENT_NAME}${CONSTANTS.CHECK_OUT_MESSAGE_8}' -z '${CONSTANTS.DEPLOYMENT_NOTE_TEXT}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONSTANTS.CHECKOUT_LAUNCHED);
  });
  // 9. Check-Out without deployment name flag
  it('9. Check-Out commands without deployment name flag', () => {
    const rv = execCmd(
      `prodly:checkout -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONSTANTS.BRANCH_MAIN}' -p '${CONSTANTS.PLAN_NAME}'  -z '${CONSTANTS.DEPLOYMENT_NOTE_TEXT}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string(CONSTANTS.ERROR_NAME_FLAG_MISSING);
    expect(response.context).to.be.string(CONSTANTS.CMD_LABEL_CHECKOUT);
    expect(response.commandName).to.be.string(CONSTANTS.CMD_LABEL_CHECKOUT);
    expect(response.name).to.be.string(CONSTANTS.SF_ERROR_LABEL);
    expect(response.stack).to.exist;
  });
  // 10. Check-Out with query filter
  it('10. Check-Out commands  with query filter', () => {
    const rv = execCmd(
      `prodly:checkout -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONSTANTS.BRANCH_MAIN}' -t '${CONSTANTS.DATASET_NAME}' -n '${CONSTANTS.CHECKOUT_DEPLOYMENT_NAME}${CONSTANTS.CHECK_OUT_MESSAGE_10}' -z '${CONSTANTS.DEPLOYMENT_NOTE_TEXT}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    console.log(response);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONSTANTS.CHECKOUT_LAUNCHED);
  });
  // 11. Check-Out with query filter flag having invalid query as value
  it('11. Check-Out commands with query filter flag having invalid query as value', () => {
    const rv = execCmd(
      `prodly:checkout -i '${process.env.CONTROL_MANAGE_ID}' -b '${CONSTANTS.BRANCH_MAIN}' -t '${CONSTANTS.DATASET_NAME}' -n '${CONSTANTS.CHECKOUT_DEPLOYMENT_NAME}${CONSTANTS.CHECK_OUT_MESSAGE_11}' -z '${CONSTANTS.DEPLOYMENT_NOTE_TEXT}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    console.log(response);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONSTANTS.CHECKOUT_LAUNCHED);
  });
});