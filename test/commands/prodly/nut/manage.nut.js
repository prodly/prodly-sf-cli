// import { execCmd } from '@salesforce/cli-plugins-testkit';
// import { expect } from 'chai';
// describe('CLI Manage Commands Automation', () => {
//   //  The default is ./bin/run.js. If you want to use a different executable, you can set the TESTKIT_EXECUTABLE_PATH environment variable to the path of the executable you want to use. For example:
//   //  process.env.TESTKIT_EXECUTABLE_PATH = './bin/dev.js';
//   let CONTROL_MANAGE
//   let S1_Manage
//   let S2_Manage
//   let S3_Manage
//   let S4_Manage
//   // Manage Commands
//   // List and Print the Manage Org
//   it('Manage - Print and List the Manage Org', () => {
//     const rv = execCmd('prodly:manage -p -l --json');
//     const response = JSON.parse(rv.shellOutput.stdout);
//     const controlOrg = response.result.instances.find(
//       (instance) => instance.platformInstanceId === '00D4x000004yyNsEAI'
//     );
//     const s2 = response.result.instances.find(
//       (instance) => instance.platformInstanceId === '00D7h000000HAQHEA4'
//     );
//     expect(controlOrg).to.exist;
//     expect(s2).to.exist;
//   });
//   // Manage with only print will throw an error
//   it('Manage - Only Print Flag', () => {
//     const rv = execCmd('prodly:manage -p --json');
//     const response = JSON.parse(rv.shellOutput.stdout);
//     expect(response.message).to.be.string('No operation flag specified for the manage command');
//     expect(response.context).to.be.string('ProdlyManage');
//     expect(response.commandName).to.be.string('ProdlyManage');
//     expect(response.name).to.be.string('SfError');
//     expect(response.stack).to.exist;
//   });
//   // Manage with only list flag
//   it('Manage - Only List Flag', () => {
//     const rv = execCmd('prodly:manage -l --json');
//     const response = JSON.parse(rv.shellOutput.stdout);
//     const controlOrg = response.result.instances.find(
//       (instance) => instance.platformInstanceId === '00D4x000004yyNsEAI'
//     );
//     const s2 = response.result.instances.find(
//       (instance) => instance.platformInstanceId === '00D7h000000HAQHEA4'
//     );
//     expect(controlOrg).to.exist;
//     expect(s2).to.exist;
//   });
//   // Without any Flags will throw an error
//   it('Manage - No Flags', () => {
//     const rv = execCmd("prodly:manage --json");
//     const response = JSON.parse(rv.shellOutput.stdout);
//     expect(response.message).to.be.string('No operation flag specified for the manage command');
//     expect(response.context).to.be.string('ProdlyManage');
//     expect(response.commandName).to.be.string('ProdlyManage');
//     expect(response.name).to.be.string('SfError');
//     expect(response.stack).to.exist;
//   });
//   // Without flag Label throws an error
//   it('Manage - Without Label flag', () => {
//     const rv = execCmd("prodly:manage -m 'a91445f3-71d6-48f0-81ba-a7de71a153aa' --json");
//     const response = JSON.parse(rv.shellOutput.stdout);
//     expect(response.message).to.be.string('Unexpected argument: a91445f3-71d6-48f0-81ba-a7de71a153aa\n');
//     expect(response.context).to.be.string('ProdlyManage');
//     expect(response.commandName).to.be.string('ProdlyManage');
//     expect(response.name).to.be.string('Error');
//     expect(response.stack).to.exist;
//   });
//   // Only Version Flag throws an error
//   it('Manage - With only  flag', () => {
//     const rv = execCmd("prodly:manage -s --json");
//     const response = JSON.parse(rv.shellOutput.stdout);
//     expect(response.message).to.be.string('No operation flag specified for the manage command');
//     expect(response.context).to.be.string('ProdlyManage');
//     expect(response.commandName).to.be.string('ProdlyManage');
//     expect(response.name).to.be.string('SfError');
//     expect(response.stack).to.exist;
//   });
//   // Unmanage the Org 
//   // it('Manage - No Flags', () => {
//   //   const rv = execCmd("prodly:manage -x --instance='a91445f3-71d6-48f0-81ba-a7de71a153aa' --json");
//   //   const response = JSON.parse(rv.shellOutput.stdout);
//   // });
// });
