export const ORG_ID_REG_EXP = /^([a-zA-Z0-9_-]){15,18}$/;

export const ORG_TYPE_PRODUCTION = 'Production';
export const ORG_TYPE_SANDBOX = 'Sandbox';
export const ORG_TYPE_SCRATCH_ORG = 'Scratch Org';

export const JOB_STATUS_COMPLETED = 'COMPLETED';

export const NO_TEST_RUN = 'NoTestRun';
export const RUN_LOCAL_TESTS = 'RunLocalTests';
export const RUN_ALL_TESTS = 'RunAllTestsInOrg';
export const RUN_SPECIFIED_TESTS = 'RunSpecifiedTests';

export const TEST_OPTIONS = [NO_TEST_RUN, RUN_LOCAL_TESTS, RUN_ALL_TESTS, RUN_SPECIFIED_TESTS] as const;
export type TTestOption = (typeof TEST_OPTIONS)[number];
