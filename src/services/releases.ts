import { Connection, SfError } from '@salesforce/core';

const BASE_PATH = '/services/apexrest/PDRI/v1/releases';

export type PostReleasesFn = ({
  body,
  hubConn,
}: {
  body: {
    [key: string]: unknown;
  };
  hubConn: Connection;
}) => Promise<{ jobId: string }>;
export const postReleases: PostReleasesFn = async ({ body, hubConn }) => {
  const request = {
    body: JSON.stringify(body),
    method: 'POST' as const,
    url: BASE_PATH,
  };
  const res: { id: string } = await hubConn.request(request);
  const jobId = res.id;
  if (!jobId) throw new SfError('No job ID returned.');
  return { jobId };
};
