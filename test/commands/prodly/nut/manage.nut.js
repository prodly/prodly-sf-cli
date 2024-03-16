import { execCmd } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';
import * as CONST from './utilities/constants.js';

describe('CLI manage commands automation', () => {
  //  The default is ./bin/run.js. If you want to use a different executable, you can set the TESTKIT_EXECUTABLE_PATH environment variable to the path of the executable you want to use. For example:
  //  process.env.TESTKIT_EXECUTABLE_PATH = './bin/dev.js';
  // Manage Commands
  // List and print the manage org
  it('1. Manage - print and list the manage org', () => {
    const rv = execCmd('prodly:manage -p -l --json');
    const response = JSON.parse(rv.shellOutput.stdout);
    const controlOrg = response.result.instances.find(
      (instance) => instance.platformInstanceId === `${process.env.CONTROL_ORG_ID}`
    );
    const s2 = response.result.instances.find(
      (instance) => instance.platformInstanceId === `${process.env.S2_ORG_ID}`
    );
    expect(controlOrg).to.exist;
    expect(s2).to.exist;
  });
  // Manage with only print will throw an error
  it('2. Manage - only print flag', () => {
    const rv = execCmd('prodly:manage -p --json');
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string(CONST.ERROR_FLAG_NOT_SPECIFIED);
    expect(response.context).to.be.string(CONST.CMD_LABEL_MANAGE);
    expect(response.commandName).to.be.string(CONST.CMD_LABEL_MANAGE);
    expect(response.name).to.be.string(CONST.SF_ERROR_LABEL);
    expect(response.stack).to.exist;
  });
  // Manage with only list flag
  it('3. Manage - only list flag', () => {
    const rv = execCmd('prodly:manage -l --json');
    const response = JSON.parse(rv.shellOutput.stdout);
    const controlOrg = response.result.instances.find(
      (instance) => instance.platformInstanceId === `${process.env.CONTROL_ORG_ID}`
    );
    const s2 = response.result.instances.find(
      (instance) => instance.platformInstanceId === `${process.env.S2_ORG_ID}`
    );
    expect(controlOrg).to.exist;
    expect(s2).to.exist;
  });
  // Without any flags will throw an error
  it('4. Manage - no flags', () => {
    const rv = execCmd("prodly:manage --json");
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string(CONST.ERROR_FLAG_NOT_SPECIFIED);
    expect(response.context).to.be.string(CONST.CMD_LABEL_MANAGE);
    expect(response.commandName).to.be.string(CONST.CMD_LABEL_MANAGE);
    expect(response.name).to.be.string(CONST.SF_ERROR_LABEL);
    expect(response.stack).to.exist;
  });
  // Without flag label throws an error
  it('5. Manage - without label flag', () => {
    const rv = execCmd(`prodly:manage -m '${process.env.S3_MANAGE_ID}' --json`);
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.contain(`Unexpected argument: '${process.env.S3_MANAGE_ID}'\n`);
    expect(response.context).to.be.string(CONST.CMD_LABEL_MANAGE);
    expect(response.commandName).to.be.string(CONST.CMD_LABEL_MANAGE);
    expect(response.name).to.be.string(CONST.ERROR);
    expect(response.stack).to.exist;
  });
  // Only version flag throws an error
  it('6. Manage - with only version flag', () => {
    const rv = execCmd("prodly:manage -s --json");
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string(CONST.ERROR_FLAG_NOT_SPECIFIED);
    expect(response.context).to.be.string(CONST.CMD_LABEL_MANAGE);
    expect(response.commandName).to.be.string(CONST.CMD_LABEL_MANAGE);
    expect(response.name).to.be.string(CONST.SF_ERROR_LABEL);
    expect(response.stack).to.exist;
  });
  // Manage with label 
  it('7. Manage - with label flag will throw an error', () => {
    const rv = execCmd(`prodly:manage -m -b '${CONST.INVALID_DATASET_NAME}' --json`);
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string(CONST.ERROR_COULD_N0T_MANAGE);
    expect(response.context).to.be.string(CONST.CMD_LABEL_MANAGE);
    expect(response.commandName).to.be.string(CONST.CMD_LABEL_MANAGE);
    expect(response.name).to.be.string(CONST.ERROR_409);
    expect(response.stack).to.exist;
  });
});
