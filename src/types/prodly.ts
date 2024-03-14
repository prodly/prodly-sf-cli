import { Connection } from '@salesforce/core';

export type ManagedInstances = {
  instances: ManagedInstance[];
};

export type ManagedInstance = {
  connectionId: string;
  controlInstance: boolean;
  id: string;
  instanceName: string;
  instanceType: string;
  instanceUrl: string;
  platformInstanceId: string;
};

export type ProdlyConnection = {
  Id: string;
  Name: string;
  PDRI__Instance_URL__c: string;
  PDRI__OrganizationId__c: string;
};

export type Jobs = {
  jobs: Job[];
};

export type Job = {
  currentStep: string;
  error: string;
  finished: string;
  id: string;
  isBlocking: boolean;
  managedInstanceId: string;
  metadata: string;
  operationType: string;
  resultData: string;
  started: string;
  status: string;
  userId: string;
};

export type DeployOptions = {
  dataSetId?: string;
  deactivateAllEvents: boolean;
  deploymentName?: string;
  deploymentNotes?: string;
  deploymentPlanId?: string;
  destinationInstanceId: string;
  hubConn: Connection;
  queryFilter?: string;
  simulation: boolean;
  sourceInstanceId?: string;
};

export type CheckoutOptions = {
  branchFlag: string | undefined;
  dataSetId: string | undefined;
  deactivateAllEvents: boolean;
  deploymentNameFlag: string | undefined;
  deploymentNotes: string | undefined;
  deploymentPlanId: string | undefined;
  filter: string | undefined;
  hubConn: Connection;
  mangedInstanceId: string;
};

export type CheckinOptions = {
  branchFlag: string | undefined;
  comment: string | undefined;
  dataSetId: string | undefined;
  deploymentNotes: string | undefined;
  deploymentPlanId: string | undefined;
  filter: string | undefined;
  hubConn: Connection;
  mangedInstanceId: string;
};
