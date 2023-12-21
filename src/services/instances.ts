import { SfError } from '@salesforce/core';
import { Jobs, ManagedInstance, ManagedInstances } from '../types/prodly.js';
import { delay } from '../utils/index.js';
import {
  GetManagedInstanceFn,
  GetManagedInstancesFn,
  ManageInstanceFn,
  UnmanageInstanceFn,
} from './instances.types.js';
import { jobCompletion } from './jobs.js';


const BASE_PATH = '/services/apexrest/PDRI/v1/instances';

const getManagedInstances: GetManagedInstancesFn = async ({ hubConn, print }) => {
  if (print) print('Retrieving all managed instances.');

  const managedInstances: ManagedInstances = await hubConn.request(`${hubConn.instanceUrl}${BASE_PATH}`);
  return managedInstances;
};

const getManagedInstance: GetManagedInstanceFn = async ({ hubConn, orgId, print }) => {
  if (print) print(`Retrieving the managed instance ID for org ${orgId}.`);

  const managedInstances = await getManagedInstances({ hubConn });
  const managedInstance = managedInstances.instances.find((instance) => instance.platformInstanceId === orgId);
  return managedInstance;
};

const manageInstance: ManageInstanceFn = async ({
  body,
  hubConn,
  orgId,
  print,
}) => {
  if (print) print(`Managing instance for org ID ${orgId}.`);

  if (print) print('Manage instance body: ' + JSON.stringify(body));

  const request = {
    // headers : { 'vcs-access-token': vcsToken },
    body: JSON.stringify(body),
    method: 'POST' as const,
    url: BASE_PATH,
  };

  const res: string = await hubConn.request(request);
  if (print) print(`Manage instance response ${res}.`);
  const jobsWrapper = JSON.parse(res) as Jobs;
  const jobId = jobsWrapper.jobs[0].id;
  if (!jobId) {
    throw new SfError('No job ID returned after submitting an instance to be managed.');
  }

  if (print) print(`Manage instance job ID ${jobId}.`);

  if (print) print(`Waiting for completion of the manage instance job ID ${jobId}.`);

  // Currently wait for no jobs to be returned, which mean the job completed, but bad way of doing this.
  let completedJob = null;
  for (let i = 0; i < 1800; i++) {
    if (print) print('Calling job completion check.');
    // eslint-disable-next-line no-await-in-loop
    const job = await jobCompletion({ jobId, hubConn, print });
    if (print) print('Completed job completion check.');
    if (job) {
      if (print) print('Job completed.');
      completedJob = job;
      break;
    }
    // eslint-disable-next-line no-await-in-loop
    await delay(1000);
  }

  if (!completedJob) {
    throw new SfError('Manage instance job did not complete within the allowed time.');
  }

  const managedInstance = JSON.parse(completedJob.resultData) as ManagedInstance;
  return managedInstance;
};

const unmanageInstance: UnmanageInstanceFn = async ({ instanceId, hubConn, print }) => {
  if (print) print(`Unmanaging instance with ID ${instanceId}.`);

  const path = `${BASE_PATH}/${instanceId}`;

  const request = {
    method: 'DELETE' as const,
    url: path,
  };
  await hubConn.request(request);

  return;
};

export { getManagedInstance, getManagedInstances, manageInstance, unmanageInstance };
