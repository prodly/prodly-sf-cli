/* eslint-disable camelcase */
import { Messages, SfError } from '@salesforce/core';
import { ORG_ID_REG_EXP, ORG_TYPE_PRODUCTION, ORG_TYPE_SANDBOX, ORG_TYPE_SCRATCH_ORG } from '../constants/index.js';
import { ProdlyConnection } from '../types/prodly.js';
import {
  CreateConnectionFn,
  GetConnectionIdFn,
  QueryConnectionFn,
  QueryConnectionsFn,
  UpdateConnectionFn,
} from './connections.types.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const prodlyMessages = Messages.loadMessages('prodlysfcli', 'prodly');

const createConnection: CreateConnectionFn = async ({ hubConn, name, org }) => {
  const trailSlashRegex = /\/$/;

  let type = '';
  if (await org.determineIfScratch()) type = ORG_TYPE_SCRATCH_ORG;
  else if (await org.determineIfSandbox()) type = ORG_TYPE_SANDBOX;
  else type = ORG_TYPE_PRODUCTION;

  const connection = {
    Name: name ? name : `${org.getUsername()} ${org.getOrgId()}`,
    PDRI__Access_Token__c: org.getConnection().getConnectionOptions().accessToken,
    PDRI__Active__c: true,
    PDRI__Instance_URL__c: org.getConnection().getConnectionOptions().instanceUrl?.replace(trailSlashRegex, ''),
    PDRI__Org_Type__c: type,
    PDRI__OrganizationId__c: org.getOrgId(),
    PDRI__User_Id__c: org.getConnection().getConnectionOptions().userId,
    PDRI__Username__c: org.getUsername(),
  };

  const retrievedConnection = await hubConn.create('PDRI__Connection__c', connection);

  return retrievedConnection.id;
};

const getConnectionId: GetConnectionIdFn = async ({ hubConn, orgId, print }) => {
  if (print) print(`Retrieving the connection record ID for org ${orgId}.`);

  const query = `
  SELECT
    Id
  FROM
    PDRI__Connection__c
  WHERE
    PDRI__OrganizationId__c = '${orgId}' AND PDRI__Active__c = true
  ORDER BY
    CreatedDate DESC
  LIMIT 1`;

  if (print) print('Running query: ' + query);

  // Query the org
  const result = await hubConn.query(query);
  if (print) print('Query result: ', result);
  if (!result?.records || result.records.length === 0) {
    return null;
  }

  if (print) print('Connection record: ' + result.records[0].Id);

  return result.records[0].Id;
};

const queryConnection: QueryConnectionFn = async ({ connectionNameOrId, hubConn, print }) => {
  if (print) print('Querying connection: ' + connectionNameOrId);

  const isId = ORG_ID_REG_EXP.test(connectionNameOrId);
  const query = `
  SELECT
    Id, Name, PDRI__OrganizationId__c
  FROM
    PDRI__Connection__c
  WHERE
    PDRI__Active__c = true AND ${isId ? 'Id' : 'Name'} = '${connectionNameOrId}'
  ORDER BY
    lastmodifieddate DESC
  LIMIT 1`;

  if (print) print(`Running source query:${query}`);

  const result = await hubConn.query(query);

  if (!result?.records || result.records.length === 0) {
    throw new SfError(prodlyMessages.getMessage('errorNoConnectionFound', [connectionNameOrId] as string[]));
  }

  return result.records[0] as ProdlyConnection;
};

const queryConnections: QueryConnectionsFn = async ({ connectionIds, hubConn, print }) => {
  if (print) print('Querying connections');

  if (connectionIds.length === 0) {
    return new Map<string, ProdlyConnection>();
  }

  const query = `
  SELECT
    Id, Name, PDRI__Instance_URL__c
  FROM
    PDRI__Connection__c
  WHERE
    Id IN (${connectionIds.map((connectionId) => `'${connectionId}'`).join(',')})`;

  if (print) print('Running source query: ' + query);

  const result = await hubConn.query(query);

  if (!result.records || result.records.length === 0) {
    throw new SfError(prodlyMessages.getMessage('errorNoConnectionFound', connectionIds));
  }

  const connections = new Map();

  result.records.forEach((connection) => {
    connections.set(connection.Id, connection);
  });

  return connections;
};

const updateConnection: UpdateConnectionFn = async ({ connectionId, hubConn, org }) => {
  const connection = {
    Id: connectionId,
    PDRI__Access_Token__c: org.getConnection()?.getConnectionOptions()?.accessToken,
  };

  return hubConn.update('PDRI__Connection__c', connection);
};

export { createConnection, getConnectionId, queryConnection, queryConnections, updateConnection };
