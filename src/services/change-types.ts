import { Connection } from '@salesforce/core';
import { ChangeType } from '../types/prodly.js';

const BASE_PATH = '/services/apexrest/PDRI/v1/change-types';

export type GetChangeTypesFn = ({ hubConn }: { hubConn: Connection }) => Promise<ChangeType[] | undefined>;

export const getChangeTypes: GetChangeTypesFn = async ({ hubConn }) => {
  const res: string = await hubConn.request(`${hubConn.instanceUrl}${BASE_PATH}`);
  const responseData = JSON.parse(res) as { changeTypes: ChangeType[] };
  return responseData.changeTypes;
};

export type GetChangeTypeFn = ({ id, hubConn }: { id: string; hubConn: Connection }) => Promise<ChangeType | undefined>;

export const getChangeType: GetChangeTypeFn = async ({ id, hubConn }) => {
  const res: string = await hubConn.request(`${hubConn.instanceUrl}${BASE_PATH}/${id}`);
  const responseData = JSON.parse(res) as { changeTypes: ChangeType[] };
  return responseData.changeTypes[0];
};
