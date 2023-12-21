import { Connection, Messages, SfError } from '@salesforce/core';
import { ORG_ID_REG_EXP } from '../constants/index.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const prodlyMessages = Messages.loadMessages('prodlysfcli', 'prodly');

const getDeploymentEntityId = async ({
  dataEntityFlag,
  dataEntityType,
  hubConn,
  print,
}: {
  dataEntityFlag: string;
  dataEntityType: string;
  hubConn: Connection;
  print?: (message?: string | undefined, ...args: unknown[]) => void;
}): Promise<string | undefined> => {
  const isId = ORG_ID_REG_EXP.test(dataEntityFlag);
  if (print) print('Is org ID: ' + isId);

  let queryWhereClause = '';
  if (isId && dataEntityType === 'PDRI__DataSet__c') {
    queryWhereClause = `PDRI__Active__c = true AND Id = '${dataEntityFlag}' `;
  } else if (isId && dataEntityType === 'PDRI__Deployment_Plan__c') {
    queryWhereClause = `Id = '${dataEntityFlag}'`;
  } else if (!isId && dataEntityType === 'PDRI__DataSet__c') {
    queryWhereClause =`PDRI__Active__c = true AND Name = '${dataEntityFlag}'`;
  } else if (!isId && dataEntityType === 'PDRI__Deployment_Plan__c') {
    queryWhereClause = `Name = '${dataEntityFlag}'`;
  }

  const query = `
  SELECT
    Id, Name
  FROM
    ${dataEntityType}
  WHERE
    ${queryWhereClause}
  ORDER BY
    lastmodifieddate DESC
  LIMIT 1`;
  if (print) print('Running query: ' + query);

  // Query the org
  const result = await hubConn.query(query);

  if (!result.records || result.records.length <= 0) {
    if (dataEntityType === 'PDRI__DataSet__c') {
      throw new SfError(prodlyMessages.getMessage('errorNoDataSetFound', [dataEntityFlag]));
    } else {
      throw new SfError(prodlyMessages.getMessage('errorNoDeploymentPlanFound', [dataEntityFlag]));
    }
  }
  return result.records[0].Id;
};

export { getDeploymentEntityId };
