import { Connection } from '@salesforce/core';
import { ManagedInstance, ManagedInstances } from '../types/prodly.js';

type printFn = (message: string) => void;

export type GetManagedInstancesFn = ({
  hubConn,
  print,
}: {
  hubConn: Connection;
  print?: printFn;
}) => Promise<ManagedInstances>;

export type GetManagedInstanceFn = ({
  hubConn,
  orgId,
  print,
}: {
  hubConn: Connection;
  orgId: string | undefined;
  print?: printFn;
}) => Promise<ManagedInstance | undefined>;

export type ManageInstanceFn = ({
  body,
  hubConn,
  orgId,
  print,
}: {
  body: {
    [key: string]: { [key: string]: unknown };
  }; 
  orgId: string;
  hubConn: Connection;
  print?: printFn;
}) => Promise<ManagedInstance>;

export type UnmanageInstanceFn = ({
  instanceId,
  hubConn,
  print,
}: {
  instanceId: string;
  hubConn: Connection;
  print?: printFn;
}) => Promise<void>;
