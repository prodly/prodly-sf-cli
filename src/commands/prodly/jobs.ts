import { Messages } from '@salesforce/core';
import { Flags, SfCommand } from '@salesforce/sf-plugins-core';
import { getJob } from '../../services/jobs.js';
import { Job } from '../../types/prodly.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const commandMessages = Messages.loadMessages('prodlysfcli', 'prodly.jobs');
const prodlyMessages = Messages.loadMessages('prodlysfcli', 'prodly');

export type JobsResult = {
  job: Job;
};

export default class ProdlyJobs extends SfCommand<JobsResult> {
  public static readonly summary = commandMessages.getMessage('summary');
  public static readonly description = prodlyMessages.getMessage('commandDescription');
  public static readonly examples = commandMessages.getMessages('examples');

  public static readonly flags = {
    'target-dev-hub': Flags.requiredHub(),
    job: Flags.string({
      char: 'j',
      required: true,
      summary: prodlyMessages.getMessage('jobIdFlagSummary'),
    }),
  };

  public async run(): Promise<JobsResult> {
    const { flags } = await this.parse(ProdlyJobs);
    const jobId = flags.job;
    const hubOrg = flags['target-dev-hub'];

    const hubConn = hubOrg.getConnection();

    this.log(`Getting job with Id "${jobId}"`);
    const job = await getJob({ hubConn, jobId });
    if (!job) {
      throw new Error(prodlyMessages.getMessage('errorJobNotFound'));
    }
    this.log(`Job Status: ${job.status}`);
    return { job };
  }
}
