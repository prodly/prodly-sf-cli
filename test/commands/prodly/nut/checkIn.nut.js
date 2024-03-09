import { execCmd } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';

describe('CLI CheckIn Commands Automation', () => {
  // 1. Check-in With all the correct Flag
  it('Check-In commands with all the flags using Dataset flag with Name', () => {
    const rv = execCmd(
      `prodly:checkin -i 'c31b1cde-7520-4f93-8b54-7347415764f3' -b 'main' -t 'Automation Dataset Account' -c 'Automation CLI checkin with all the flags' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string('Checkin launched');
  });

  // 2. Check-in Without Instance flag 
  it('Check-In commands Without Instance flag using Dataset flag with Name', () => {
    const rv = execCmd(
      "prodly:checkin -b 'main' -t 'Automation Dataset Account' -c 'Automation Test CLI checkin with Without Instance flag' --json"
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string('Checkin launched');
  });

  //3. Check-in With all the correct Flag
  it('Check-In commands without branch flag using Dataset flag with Name', () => {
    const rv = execCmd(
      `prodly:checkin -i 'c31b1cde-7520-4f93-8b54-7347415764f3' -t 'Automation Dataset Account' -c 'Automation Test CLI' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string('Checkin launched');
  });
  // 4. Check-in Without dataset flag
  it('Check-In commands Without dataset flag with Name flag', () => {
    const rv = execCmd(
      `prodly:checkin -i 'c31b1cde-7520-4f93-8b54-7347415764f3' -b 'main' -c 'Automation Test CLI' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string('Specify either the data set or deployment plan parameter.');
    expect(response.context).to.be.string('ProdlyCheckin');
    expect(response.commandName).to.be.string('ProdlyCheckin');
    expect(response.name).to.be.string('SfError');
    expect(response.stack).to.exist;
  });
  // 5. Check-in with the dataset flag having wrong value
  it('Check-In commands with the dataset flag having wrong value', () => {
    const rv = execCmd(
      `prodly:checkin -i 'c31b1cde-7520-4f93-8b54-7347415764f3' -b 'main' -t 'Automation' -c 'Automation Test CLI ' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string("No active data set with the name or record ID 'Automation' found in the dev hub control org.");
    expect(response.context).to.be.string('ProdlyCheckin');
    expect(response.commandName).to.be.string('ProdlyCheckin');
    expect(response.name).to.be.string('SfError');
    expect(response.stack).to.exist;
  });
  // 6. Check-in with flexible branch
  it('Check-In commands with flexible branch', () => {
    const rv = execCmd(
      `prodly:checkin -i 'c31b1cde-7520-4f93-8b54-7347415764f3' -b 'S3' -t 'Automation Dataset Account' -c 'Automation Test CLI checkin with flexible branch' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string('Checkin launched');
  });
  // 8. Check-in With plan flag but invalid value
  it('Check-In commands with all the flags using Dataset flag with Name', () => {
    const rv = execCmd(
      `prodly:checkin -i 'c31b1cde-7520-4f93-8b54-7347415764f3' -b 'main' -p 'Automation Dataset' -c 'CLI checkin Plan Flag with invalid value' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string("No deployment plan with the name or record ID 'Automation Dataset' found in the dev hub control org.");
    expect(response.context).to.be.string('ProdlyCheckin');
    expect(response.commandName).to.be.string('ProdlyCheckin');
    expect(response.name).to.be.string('SfError');
    expect(response.stack).to.exist;
  });
  // 9. Check-in With plan flag and notes flag
  it('Check-In commands With plan flag and notes flag', () => {
    const rv = execCmd(
      `prodly:checkin -i 'c31b1cde-7520-4f93-8b54-7347415764f3' -b 'main' -p 'Automation Deployment Plan' -c 'CLI checkin Plan Flag with notes flags' -z 'CLI Notes' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string('Checkin launched');
  });
  // 10. Check-in Without comment flag
  it('Check-In commands Without comment flag', () => {
    const rv = execCmd(
      `prodly:checkin -i 'c31b1cde-7520-4f93-8b54-7347415764f3' -b 'main' -p 'Automation Deployment Plan' -z 'CLI Notes' --json`
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.contain(`{"errorMessage":"Commit message is required."}`);
    expect(response.context).to.be.string('ProdlyCheckin');
    expect(response.commandName).to.be.string('ProdlyCheckin');
    expect(response.name).to.be.string('ERROR_HTTP_400');
    expect(response.stack).to.exist;
  });
});