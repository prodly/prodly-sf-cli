import { Connection } from '@salesforce/core';
import { Job } from '../types/prodly.js';

type printFn = (message: string) => void;

export type JobCompletionFn = ({
  hubConn,
  jobId,
  print,
}: {
  hubConn: Connection;
  jobId: string;
  print?: printFn;
}) => Promise<Job | undefined>;