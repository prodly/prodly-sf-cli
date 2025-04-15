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

export type ChangeType = {
  dataset: NameAndId;
  deploymentPlan: NameAndId;
  durationDays: number;
  generatedEnvironmentType: string;
  id: string;
  managedEnvironment: CTManagedEnvironment;
  metadataFilter: NameAndId;
  metadataRollbackOnFailure: boolean;
  name: string;
  salesforcePackageIds: string[];
  skipDataOnMetadataFailure: boolean;
};

export type CTManagedEnvironment = {
  controlInstance: boolean;
  id: string;
  instanceId: string;
  instanceName: string;
  instanceType: string;
  instanceUrl: string;
  licenseType: string;
};

export type NameAndId = {
  id: string;
  name: string;
};

export type WorkItem = {
  Id: string;
  Name: string;
  PDRI__Name__c: string;
  PDRI__Description__c: string;
  PDRI__Issue_Type__c: string;
  PDRI__Link__c: string;
  PDRI__Work_Item_ID__c: string;
  PDRI__Work_Item_Key__c: string;
  PDRI__Work_Item_Type__c: string;
};

export type Bundle = {
  workItems: WorkItem[];
  Id: string;
  PDRI__Deployment_Bundle_Name__c: string;
  PDRI__Deployment_Bundle_Type__c: string;
  PDRI__Metadata_Rollback_On_Failure__c: string;
  PDRI__Skip_Data_On_Metadata_Failure__c: string;
  PDRI__Test_Level__c: string;
};

export type BundleRelationship = {
  bundle: Bundle;
  Id: string;
  PDRI__Deployment_Order__c: number;
};

export type ReleaseConfiguration = {
  releaseBundleRelationships?: BundleRelationship[];
  Id: string;
  Name: string;
  PDRI__Release_Name__c: string;
  PDRI__Description__c?: string;
  PDRI__Status__c: string;
  CreatedDate: string;
  LastModifiedDate: string;
  'CreatedBy.Name': string;
  'CreatedBy.Username': string;
  'CreatedBy.Id': string;
  'LastModifiedBy.Name': string;
  'LastModifiedBy.Username': string;
  'LastModifiedBy.Id': string;
};

export type ReleasesResponse = {
  id: string;
};
