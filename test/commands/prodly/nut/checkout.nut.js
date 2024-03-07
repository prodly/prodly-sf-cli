import { execCmd } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';
describe('CLI CheckOut Commands Automation', () => {
  // 1. Check-Out With all the correct Flag
  it('Check-Out commands with all the flags using Dataset flag with Name', () => {
    const rv = execCmd(
      "prodly:checkout -i 'c31b1cde-7520-4f93-8b54-7347415764f3' -b 'main' -t 'Automation Dataset Account' -n 'Automation Test CLI Checkout with all the flags' --json"
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string('Checkout launched');
  });

  // 2. Check-Out Without Instance flag 
  it('Check-Out commands Without Instance flag using Dataset flag with Name', () => {
    const rv = execCmd(
      "prodly:checkout -b 'main' -t 'Automation Dataset Account' -n 'Automation Test CLI Checkout with Without Instance flag' --json"
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string('Checkout launched');
  });

  //3. Check-Out With all the correct Flag
  it('Check-Out commands without branch flag using Dataset flag with Name', () => {
    const rv = execCmd(
      "prodly:checkout -i 'c31b1cde-7520-4f93-8b54-7347415764f3' -t 'Automation Dataset Account' -n 'Automation Test CLI' --json"
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string('Checkout launched');
  });
  // 4. Check-Out Without dataset flag
  it('Check-Out commands Without dataset flag with Name flag', () => {
    const rv = execCmd(
      "prodly:checkout -i 'c31b1cde-7520-4f93-8b54-7347415764f3' -b 'main' -n 'Automation Test CLI' --json"
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string('Specify either the data set or deployment plan parameter.');
    expect(response.context).to.be.string('ProdlyCheckout');
    expect(response.commandName).to.be.string('ProdlyCheckout');
    expect(response.name).to.be.string('SfError');
    expect(response.stack).to.exist;
  });
  // 5. Check-Out with the dataset flag having wrong value
  it('Check-Out commands with the dataset flag having wrong value', () => {
    const rv = execCmd(
      "prodly:checkout -i 'c31b1cde-7520-4f93-8b54-7347415764f3' -b 'main' -t 'Automation' -n 'Automation Test CLI ' --json"
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string("No active data set with the name or record ID 'Automation' found in the dev hub control org.");
    expect(response.context).to.be.string('ProdlyCheckout');
    expect(response.commandName).to.be.string('ProdlyCheckout');
    expect(response.name).to.be.string('SfError');
    expect(response.stack).to.exist;
  });
  // 6. Check-Out with flexible branch
  it('Check-Out commands with flexible branch', () => {
    const rv = execCmd(
      "prodly:checkout -i 'c31b1cde-7520-4f93-8b54-7347415764f3' -b 'S3' -t 'Automation Dataset Account' -n 'Automation Test CLI Checkout with flexible branch' --json"
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string('Checkout launched');
  });
  // 8. Check-Out With plan flag but invalid value
  it('Check-Out commands with all the flags using Dataset flag with Name', () => {
    const rv = execCmd(
      "prodly:checkout -i 'c31b1cde-7520-4f93-8b54-7347415764f3' -b 'main' -p 'Automation Dataset' -n 'CLI Checkout Plan Flag with invalid value' --json"
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string("No deployment plan with the name or record ID 'Automation Dataset' found in the dev hub control org.");
    expect(response.context).to.be.string('ProdlyCheckout');
    expect(response.commandName).to.be.string('ProdlyCheckout');
    expect(response.name).to.be.string('SfError');
    expect(response.stack).to.exist;
  });
  // 9. Check-Out With plan flag and notes flag
  it('Check-Out commands With plan flag and notes flag', () => {
    const rv = execCmd(
      "prodly:checkout -i 'c31b1cde-7520-4f93-8b54-7347415764f3' -b 'main' -p 'Automation Deployment Plan' -n 'CLI Checkout Plan Flag with notes flags' -z 'CLI Notes' --json"
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.result.jobId).to.exist;
    expect(response.result.message).to.be.string('Checkout launched');
  });
  // 10. Check-Out Without deployment name flag
  it('Check-Out commands Without deployment name flag', () => {
    const rv = execCmd(
      "prodly:checkout -i 'c31b1cde-7520-4f93-8b54-7347415764f3' -b 'main' -p 'Automation Deployment Plan'  -z 'CLI Notes' --json"
    );
    const response = JSON.parse(rv.shellOutput.stdout);
    expect(response.message).to.be.string('Deployment name flag is required.');
    expect(response.context).to.be.string('ProdlyCheckout');
    expect(response.commandName).to.be.string('ProdlyCheckout');
    expect(response.name).to.be.string('SfError');
    expect(response.stack).to.exist;
  });
});