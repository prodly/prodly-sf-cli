import { JOB_STATUS_COMPLETED } from '../constants/index.js';
import { Jobs } from '../types/prodly.js';
import { JobCompletionFn } from './jobs.types.js';

const BASE_PATH = '/services/apexrest/PDRI/v1/jobs';

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

export { jobCompletion };
