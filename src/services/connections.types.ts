import { Connection, Org } from '@salesforce/core';
import { ProdlyConnection } from '../types/prodly.js';
import { SaveResult } from '../types/salesforce.js';

type printFn = (message?: string | undefined, ...args: unknown[]) => void;

export type CreateConnectionFn = ({
  hubConn,
  name,
  org,
  print,
}: {
  hubConn: Connection;
  name: string | undefined;
  org: Org;
  print?: printFn;
}) => Promise<string | undefined>;

export type GetConnectionIdFn = ({
  hubConn,
  orgId,
  print,
}: {
  hubConn: Connection;
  orgId: string;
  print?: printFn;
}) => Promise<string | null | undefined>;

export type QueryConnectionFn = ({
  connectionNameOrId,
  hubConn,
  print,
}: {
  connectionNameOrId: string;
  hubConn: Connection;
  print?: printFn;
}) => Promise<ProdlyConnection>;

export type QueryConnectionsFn = ({
  connectionIds,
  hubConn,
  print,
}: {
  connectionIds: string[];
  hubConn: Connection;
  print?: printFn;
}) => Promise<Map<string, ProdlyConnection>>;

export type UpdateConnectionFn = ({
  connectionId,
  hubConn,
  org,
}: {
  connectionId: string;
  hubConn: Connection;
  org: Org;
}) => Promise<SaveResult>;
