import { Connection } from '@salesforce/core';
import { VCSRepoFolder } from '../types/prodly.js';

const BASE_PATH = '/services/apexrest/PDRI/v1/configuration-management';
const ENDPOINT_URLS = {
  VCS_REPO_FOLDERS: `${BASE_PATH}/vcs-repo-folders`,
};

export type GetVCSRepoFoldersFn = ({ hubConn }: { hubConn: Connection }) => Promise<VCSRepoFolder[] | undefined>;

export const getVCSRepoFolders: GetVCSRepoFoldersFn = async ({ hubConn }) => {
  const res: string = await hubConn.request(`${hubConn.instanceUrl}${ENDPOINT_URLS.VCS_REPO_FOLDERS}`);
  const responseData = JSON.parse(res) as VCSRepoFolder[];
  return responseData;
};
