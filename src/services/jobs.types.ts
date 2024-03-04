import { Connection } from '@salesforce/core';
import { Job } from '../types/prodly.js';

type printFn = (message: string) => void;

export type GetJobFn = ({ hubConn, jobId }: { hubConn: Connection; jobId: string }) => Promise<Job | undefined>;

export type JobCompletionFn = ({
  hubConn,
  jobId,
  print,
}: {
  hubConn: Connection;
  jobId: string;
  print?: printFn;
}) => Promise<Job | undefined>;
