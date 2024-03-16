import { execCmd } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';
import * as CONST from './utilities/constants.js';

describe('CLI deploy commands automation', () => {
  // Deploy Commands
  // 1. Deploy without dataset/plan flag 
  it('1. Deploy commands without dataset/plan flag', () => {
    const rv = execCmd(
      `prodly:deploy -s '${process.env.CONTROL_MANAGE_ID}' -d '${process.env.S4_MANAGE_ID}' -n '${CONST.DEPLOYMENT_NAME}${CONST.DEPLOY_MESSAGE_1}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string(CONST.ERROR_DATASET_PLAN_FLAG_MISSING);
    expect(response.context).to.be.string(CONST.CMD_LABEL_DEPLOY);
    expect(response.commandName).to.be.string(CONST.CMD_LABEL_DEPLOY);
    expect(response.name).to.be.string(CONST.SF_ERROR_LABEL);
    expect(response.stack).to.exist;
  });
  // 2. Deploy all the correct the flags
  it('2. Deploy commands with all the flags', () => {
    const rv = execCmd(
      `prodly:deploy -s '${process.env.CONTROL_MANAGE_ID}' -d '${process.env.S4_MANAGE_ID}' -t '${CONST.DATASET_NAME}' -n '${CONST.DEPLOYMENT_NAME}${CONST.DEPLOY_MESSAGE_2}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONST.DEPLOYMENT_LAUNCHED);
  });
  // 3. Deploy without destination flag
  it('3. Deploy command without destination flag', () => {
    const rv = execCmd(
      `prodly:deploy -s '${process.env.CONTROL_MANAGE_ID}' -t '${CONST.DATASET_NAME}' -n '${CONST.DEPLOYMENT_NAME}${CONST.DEPLOY_MESSAGE_3}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONST.DEPLOYMENT_LAUNCHED);
  });
  // 4. Deploy command without source flag
  it('4. Deploy command without source flag', () => {
    const rv = execCmd(
      `prodly:deploy -d '${process.env.CONTROL_MANAGE_ID}' -t '${CONST.DATASET_NAME}' -n '${CONST.DEPLOYMENT_NAME}${CONST.DEPLOY_MESSAGE_4}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONST.DEPLOYMENT_LAUNCHED);
  });
  // 5. Deployment plan flag having name as value
  it('5. Deployment plan flag having name as value', () => {
    const rv = execCmd(
      `prodly:deploy -s '${process.env.CONTROL_MANAGE_ID}' -d '${process.env.S4_MANAGE_ID}' -p '${CONST.PLAN_NAME}' -n '${CONST.DEPLOYMENT_NAME}${CONST.DEPLOY_MESSAGE_5}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONST.DEPLOYMENT_LAUNCHED);
  });
  // 6. Deploy command without source and destination flag
  it('6. Deploy command without source & destination flag', () => {
    const rv = execCmd(
      `prodly:deploy  -t '${CONST.DATASET_NAME}' -n '${CONST.DEPLOYMENT_NAME}${CONST.DEPLOY_MESSAGE_6}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONST.DEPLOYMENT_LAUNCHED);
  });
  // 7. Deploy commands with dataset flag having invalid value in it
  it('7. Dataset flag having invalid name as value', () => {
    const rv = execCmd(
      `prodly:deploy -s '${process.env.CONTROL_MANAGE_ID}' -d '${process.env.S4_MANAGE_ID}' -t '${CONST.INVALID_DATASET_NAME}' -n '${CONST.DEPLOYMENT_NAME}${CONST.DEPLOY_MESSAGE_7}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string(CONST.ERROR_INVALID_DATASET_VALUE);
    expect(response.context).to.be.string(CONST.CMD_LABEL_DEPLOY);
    expect(response.commandName).to.be.string(CONST.CMD_LABEL_DEPLOY);
    expect(response.name).to.be.string(CONST.SF_ERROR_LABEL);
    expect(response.stack).to.exist;
  });
  // 8. Deploy commands with plan flag having invalid value in it
  it('8. Deployment plan flag having invalid name as value', () => {
    const rv = execCmd(
      `prodly:deploy -s '${process.env.CONTROL_MANAGE_ID}' -d '${process.env.S4_MANAGE_ID}' -p '${CONST.INVALID_PLAN_NAME}' -n '${CONST.DEPLOYMENT_NAME}${CONST.DEPLOY_MESSAGE_8}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string(CONST.INVALID_PLAN_NAME);
    expect(response.context).to.be.string(CONST.CMD_LABEL_DEPLOY);
    expect(response.commandName).to.be.string(CONST.CMD_LABEL_DEPLOY);
    expect(response.name).to.be.string(CONST.SF_ERROR_LABEL);
    expect(response.stack).to.exist;
  });
  // 9. Without deployment name flag 
  it('9. Deploy commands without deployment name flag throws an error', () => {
    const rv = execCmd(
      `prodly:deploy -s '${process.env.CONTROL_MANAGE_ID}' -d '${process.env.S4_MANAGE_ID}' -t '${CONST.DATASET_NAME}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.contain(CONST.ERROR_INVALID_FIELD);
    expect(response.context).to.be.string(CONST.CMD_LABEL_DEPLOY);
    expect(response.commandName).to.be.string(CONST.CMD_LABEL_DEPLOY);
    expect(response.name).to.be.string(CONST.ERROR_400);
    expect(response.stack).to.exist;
  });
  // 10.  With deployment note flag
  it('10. Deploy commands with deployment note flag', () => {
    const rv = execCmd(
      `prodly:deploy -s '${process.env.CONTROL_MANAGE_ID}' -d '${process.env.S4_MANAGE_ID}' -t '${CONST.DATASET_NAME}' -n '${CONST.DEPLOYMENT_NAME}${CONST.DEPLOY_MESSAGE_10}' -z '${CONST.DEPLOYMENT_NOTE_TEXT}' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONST.DEPLOYMENT_LAUNCHED);
  });
  // 11. Simulation
  it('11. Deploy commands using simulation flag', () => {
    const rv = execCmd(
      `prodly:deploy -s '${process.env.CONTROL_MANAGE_ID}' -d '${process.env.S4_MANAGE_ID}' -t '${CONST.DATASET_NAME}' -n '${CONST.DEPLOYMENT_NAME}${CONST.DEPLOY_MESSAGE_11}' -z '${CONST.DEPLOYMENT_NOTE_TEXT}' -l --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONST.DEPLOYMENT_LAUNCHED);
  });
  // Deactivate events
  it('12. Deploy commands with deactivate event control', () => {
    const rv = execCmd(
      `prodly:deploy -s '${process.env.CONTROL_MANAGE_ID}' -d '${process.env.S4_MANAGE_ID}' -t '${CONST.DATASET_NAME}' -n '${CONST.DEPLOYMENT_NAME}${CONST.DEPLOY_MESSAGE_12}' -z '${CONST.DEPLOYMENT_NOTE_TEXT}' --deactivate --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONST.DEPLOYMENT_LAUNCHED);
  });
  // Query Override
  it('13. Deploy commands With query override flag', () => {
    const rv = execCmd(
      `prodly:deploy -s '${process.env.CONTROL_MANAGE_ID}' -d '${process.env.S4_MANAGE_ID}' -t '${CONST.DATASET_NAME}' -n '${CONST.DEPLOYMENT_NAME}${CONST.DEPLOY_MESSAGE_13}' -z '${CONST.DEPLOYMENT_NOTE_TEXT}' -q "${CONST.QUERY}" --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONST.DEPLOYMENT_LAUNCHED);
  });
  // Query override with wrong in it.
  it('14. Deploy commands with query override with wrong in it', () => {
    const rv = execCmd(
      `prodly:deploy -s '${process.env.CONTROL_MANAGE_ID}' -d '${process.env.S4_MANAGE_ID}' -t '${CONST.DATASET_NAME}' -n '${CONST.DEPLOYMENT_NAME}${CONST.DEPLOY_MESSAGE_14}' -z '${CONST.DEPLOYMENT_NOTE_TEXT}' -q "${CONST.INVALID_QUERY}" --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string(CONST.DEPLOYMENT_LAUNCHED);
  });
});