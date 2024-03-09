// import { execCmd } from '@salesforce/cli-plugins-testkit';
// import { expect } from 'chai';
// describe('CLI Deploy Commands Automation', () => {
//   // Deploy Commands
//   // 1. Deploy without Dataset/Plan Flag 
//   it('Deploy commands without Dataset/Plan Flag', () => {
//     const rv = execCmd(
//       "prodly:deploy -s 'c31b1cde-7520-4f93-8b54-7347415764f3' -d '4c1136db-382a-40a8-b5db-de39f97bd8bb' -n 'Automation Test CLI' --json"
//     );
//     const response = JSON.parse(rv.shellOutput.stdout);
//     expect(response.message).to.be.string('Specify either the data set or deployment plan parameter.');
//     expect(response.context).to.be.string('ProdlyDeploy');
//     expect(response.commandName).to.be.string('ProdlyDeploy');
//     expect(response.name).to.be.string('SfError');
//     expect(response.stack).to.exist;
//   });

//   // 2. Deploy all the correct the flags using Dataset flag with Name
//   it('Deploy commands with all the flags using Dataset flag with Name', () => {
//     const rv = execCmd(
//       "prodly:deploy -s 'c31b1cde-7520-4f93-8b54-7347415764f3' -d '4c1136db-382a-40a8-b5db-de39f97bd8bb' -t 'Automation Dataset Account' -n 'Automation Test CLI' --json"
//     );
//     const response = JSON.parse(rv.shellOutput.stdout);
//     expect(response.result.jobId).to.exist;
//     expect(response.result.message).to.be.string('Deployment launched');
//   });
//   // 3. Deploy Without Destination Flag
//   it('Deploy Command without destination flag', () => {
//     const rv = execCmd(
//       "prodly:deploy -s 'c31b1cde-7520-4f93-8b54-7347415764f3' -t 'Automation Dataset Account' -n 'Automation Test CLI without destination' --json"
//     );
//     const response = JSON.parse(rv.shellOutput.stdout);
//     expect(response.result.jobId).to.exist;
//     expect(response.result.message).to.be.string('Deployment launched');
//   });
//   // 4. Deploy Command without source flag
//   it('Deploy Command without source flag', () => {
//     const rv = execCmd(
//       "prodly:deploy -d '4c1136db-382a-40a8-b5db-de39f97bd8bb' -t 'Automation Dataset Account' -n 'Automation Test CLI without source' --json"
//     );
//     const response = JSON.parse(rv.shellOutput.stdout);
//     expect(response.result.jobId).to.exist;
//     expect(response.result.message).to.be.string('Deployment launched');
//   });
//   // 5. Deployment Plan flag having name as value
//   it('Deployment Plan flag having name as value', () => {
//     const rv = execCmd(
//       "prodly:deploy -s 'c31b1cde-7520-4f93-8b54-7347415764f3' -d '4c1136db-382a-40a8-b5db-de39f97bd8bb' -p 'Automation Deployment Plan' -n 'Automation CLI Deployment Plan Flag with Name' --json"
//     );
//     const response = JSON.parse(rv.shellOutput.stdout);
//     expect(response.result.jobId).to.exist;
//     expect(response.result.message).to.be.string('Deployment launched');
//   });
//   // 6. Deploy Command without source and destination
//   it('Deploy Command without source flag', () => {
//     const rv = execCmd(
//       "prodly:deploy  -t 'Automation Dataset Account' -n 'Automation Test CLI without source & Destination' --json"
//     );
//     const response = JSON.parse(rv.shellOutput.stdout);
//     expect(response.result.jobId).to.exist;
//     expect(response.result.message).to.be.string('Deployment launched');
//   });
//   // 7. Deploy Commands with dataset flag having invalid value in it
//   it('Dataset flag having Invalid name as value', () => {
//     const rv = execCmd(
//       "prodly:deploy -s 'c31b1cde-7520-4f93-8b54-7347415764f3' -d '4c1136db-382a-40a8-b5db-de39f97bd8bb' -t 'Automation' -n 'Automation CLI Dataset flag with Incorrect Dataset Name' --json"
//     );
//     const response = JSON.parse(rv.shellOutput.stdout);
//     expect(response.message).to.be.string("No active data set with the name or record ID 'Automation' found in the dev hub control org.");
//     expect(response.context).to.be.string('ProdlyDeploy');
//     expect(response.commandName).to.be.string('ProdlyDeploy');
//     expect(response.name).to.be.string('SfError');
//     expect(response.stack).to.exist;
//   });
//   // 8. Deploy Commands with plan flag having invalid value in it
//   it('Deployment Plan flag having Invalid name as value', () => {
//     const rv = execCmd(
//       "prodly:deploy -s 'c31b1cde-7520-4f93-8b54-7347415764f3' -d '4c1136db-382a-40a8-b5db-de39f97bd8bb' -p 'Automation' -n 'Automation CLI plan flag with Incorrect plan Name' --json"
//     );
//     const response = JSON.parse(rv.shellOutput.stdout);
//     expect(response.message).to.be.string("No deployment plan with the name or record ID 'Automation' found in the dev hub control org.");
//     expect(response.context).to.be.string('ProdlyDeploy');
//     expect(response.commandName).to.be.string('ProdlyDeploy');
//     expect(response.name).to.be.string('SfError');
//     expect(response.stack).to.exist;
//   });
//   // 9. Without Deployment Name Flag 
//   it('Deploy commands Without Deployment Name Flag throws an error', () => {
//     const rv = execCmd(
//       "prodly:deploy -s 'c31b1cde-7520-4f93-8b54-7347415764f3' -d '4c1136db-382a-40a8-b5db-de39f97bd8bb' -t 'Automation Dataset Account' --json"
//     );
//     const response = JSON.parse(rv.shellOutput.stdout);
//     expect(response.message).to.contain(`{"errorMessage":"A field on the incoming request is invalid."}`);
//     expect(response.context).to.be.string('ProdlyDeploy');
//     expect(response.commandName).to.be.string('ProdlyDeploy');
//     expect(response.name).to.be.string('ERROR_HTTP_400');
//     expect(response.stack).to.exist;
//   });
//   // 10.  With Deployment Note flag
//   it('Deploy commands With Deployment Note Flag throws an error', () => {
//     const rv = execCmd(
//       "prodly:deploy -s 'c31b1cde-7520-4f93-8b54-7347415764f3' -d '4c1136db-382a-40a8-b5db-de39f97bd8bb' -t 'Automation Dataset Account' -n 'Automation CLI with notes' -z 'This is notes flag from cli' --json"
//     );
//     const response = JSON.parse(rv.shellOutput.stdout);
//     expect(response.result.jobId).to.exist;
//     expect(response.result.message).to.be.string('Deployment launched');
//   });
//   // 11. Simulation
//   it('Deploy commands using simulation flag', () => {
//     const rv = execCmd(
//       "prodly:deploy -s 'c31b1cde-7520-4f93-8b54-7347415764f3' -d '4c1136db-382a-40a8-b5db-de39f97bd8bb' -t 'Automation Dataset Account' -n 'Automation CLI Simulation' -z 'Simulation This is notes flag from cli' -l --json"
//     );
//     const response = JSON.parse(rv.shellOutput.stdout);
//     expect(response.result.jobId).to.exist;
//     expect(response.result.message).to.be.string('Deployment launched');
//   });
//   // Deactivate events
//   it('Deploy commands With Deactivate event control', () => {
//     const rv = execCmd(
//       "prodly:deploy -s 'c31b1cde-7520-4f93-8b54-7347415764f3' -d '4c1136db-382a-40a8-b5db-de39f97bd8bb' -t 'Automation Dataset Account' -n 'Automation CLI Event Control' -z 'This is notes flag from cli' --deactivate --json"
//     );
//     const response = JSON.parse(rv.shellOutput.stdout);
//     expect(response.result.jobId).to.exist;
//     expect(response.result.message).to.be.string('Deployment launched');
//   });
//   // Query Override
//   it('Deploy commands With Query Override Flag', () => {
//     const rv = execCmd(
//       `prodly:deploy -s 'c31b1cde-7520-4f93-8b54-7347415764f3' -d '4c1136db-382a-40a8-b5db-de39f97bd8bb' -t 'Automation Dataset Account' -n 'Automation CLI with query override' -z 'This is notes flag from cli' -q "Name like 'Automation%'" --json`
//     );
//     const response = JSON.parse(rv.shellOutput.stdout);
//     expect(response.result.jobId).to.exist;
//     expect(response.result.message).to.be.string('Deployment launched');
//   });
//   // Query Override with wrong in it.
//   it('Deploy commands WithQuery Override with wrong in it', () => {
//     const rv = execCmd(
//       `prodly:deploy -s 'c31b1cde-7520-4f93-8b54-7347415764f3' -d '4c1136db-382a-40a8-b5db-de39f97bd8bb' -t 'Automation Dataset Account' -n 'Automation CLI with query override' -z 'This is notes flag from cli' -q "Autom" --json`
//     );
//     const response = JSON.parse(rv.shellOutput.stdout);
//     expect(response.result.jobId).to.exist;
//     expect(response.result.message).to.be.string('Deployment launched');
//   });

// });