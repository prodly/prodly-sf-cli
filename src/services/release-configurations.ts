import { Connection } from '@salesforce/core';
import { ReleaseConfiguration } from '../types/prodly.js';
import { hubRequest } from '../utils/index.js';

const BASE_PATH = '/services/apexrest/PDRI/v1/release-configurations';

export type GetReleasesFn = ({ hubConn }: { hubConn: Connection }) => Promise<ReleaseConfiguration[] | undefined>;

export const getReleases: GetReleasesFn = async ({ hubConn }) => {
  const res = await hubRequest<string>(hubConn, `${hubConn.instanceUrl}${BASE_PATH}`);
  const responseData = JSON.parse(res) as { data: ReleaseConfiguration[] };
  return responseData.data;
};
