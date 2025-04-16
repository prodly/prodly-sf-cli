import { Connection } from '@salesforce/core';
import { ReleaseConfiguration } from '../types/prodly.js';

const BASE_PATH = '/services/apexrest/PDRI/v1/release-configurations';

export type GetReleasesFn = ({ hubConn }: { hubConn: Connection }) => Promise<ReleaseConfiguration[] | undefined>;

export const getReleases: GetReleasesFn = async ({ hubConn }) => {
  const res: string = await hubConn.request(`${hubConn.instanceUrl}${BASE_PATH}`);
  const responseData = JSON.parse(res) as { data: ReleaseConfiguration[] };
  return responseData.data;
};
