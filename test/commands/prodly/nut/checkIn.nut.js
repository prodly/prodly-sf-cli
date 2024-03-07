import { execCmd } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';
describe('CLI CheckIn Commands Automation', () => {
  // Check-in With all the correct Flag
  it('Check-In commands with all the flags using Dataset flag with Name', () => {
    const rv = execCmd(
      "prodly:checkin -i 'c31b1cde-7520-4f93-8b54-7347415764f3' -b 'main' -t 'Automation Dataset Account' -c 'Automation Test CLI checkin with all the flags' --json"
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string('Checkin launched');
  });
});