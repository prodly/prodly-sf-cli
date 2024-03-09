// import { execCmd } from '@salesforce/cli-plugins-testkit';
// import { expect } from 'chai';
// describe('CLI JOBS Commands Automation', () => {
//   // Job command without value.
//   it('Jobs With Job flag but without value', () => {
//     const rv = execCmd(
//       `prodly:jobs -j --json`
//     );
//     const response = JSON.parse(rv.shellOutput.stdout);
//     expect(response.message).to.be.string('Flag --job expects a value');
//     expect(response.context).to.be.string('ProdlyJobs');
//     expect(response.commandName).to.be.string('ProdlyJobs');
//     expect(response.name).to.be.string('Error');
//     expect(response.stack).to.exist;
//   });
//   // Job command with value
//   it('Jobs With Job flag but with value', () => {
//     const rv = execCmd(
//       `prodly:jobs -j "e4ca3c93-376b-4092-aa92-458c7d7410dd" --json`
//     );
//     const response = JSON.parse(rv.shellOutput.stdout);
//     expect(response.result.job.status).to.be.string('COMPLETED');
//   });
//   // Job command with InValid value
//   it('Jobs With Job flag but with value', () => {
//     const rv = execCmd(

//       `prodly:jobs -j "e4ca3c93-376b-4092-aa92-458c7d" --json`
//     );
//     const response = JSON.parse(rv.shellOutput.stdout);
//     expect(response.message).to.contain(`{"errorMessage":"The requested entity was not found."}`);
//     expect(response.context).to.be.string('ProdlyJobs');
//     expect(response.commandName).to.be.string('ProdlyJobs');
//     expect(response.name).to.be.string('ERROR_HTTP_404');
//     expect(response.stack).to.exist;
//   });
// });