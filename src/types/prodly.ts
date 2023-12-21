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
