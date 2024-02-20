import { JOB_STATUS_COMPLETED } from '../constants/index.js';
import { Jobs } from '../types/prodly.js';
import { GetJobFn, JobCompletionFn } from './jobs.types.js';

const BASE_PATH = '/services/apexrest/PDRI/v1/jobs';

const getJob: GetJobFn = async ({ hubConn, jobId }) => {
  const path = `${BASE_PATH}/${jobId}`;
  const res: string = await hubConn.request(`${hubConn.instanceUrl}${path}`);
  const jobsWrapper = JSON.parse(res) as Jobs;
  return jobsWrapper.jobs[0];
};

const jobCompletion: JobCompletionFn = async ({ hubConn, jobId, print }) => {
  const path = `${BASE_PATH}/${jobId}`;

  const res: string = await hubConn.request(`${hubConn.instanceUrl}${path}`);
  if (print) print(`Job status result ${JSON.stringify(res)}.`);
  const jobsWrapper = JSON.parse(res) as Jobs;
  const job = jobsWrapper.jobs[0];

  if (print) print(`Job status job ${JSON.stringify(job)}.`);

  if (job.status === JOB_STATUS_COMPLETED) {
    return job;
  } else {
    return undefined;
  }
};

export { getJob, jobCompletion };
