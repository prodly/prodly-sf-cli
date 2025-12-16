import { SfError } from '@salesforce/core';
import { RUN_SPECIFIED_TESTS, TTestOption } from '../constants/index.js';
import { QuickDeploymentComponent } from '../types/prodly.js';

const constructQueryFilter = (
  filterFlag: string | undefined
): { filter?: string | null; limit?: null; orderBy?: null } => {
  if (typeof filterFlag === 'string') {
    if (filterFlag.length === 0) {
      return {
        filter: null,
        limit: null,
        orderBy: null,
      };
    } else {
      return { filter: filterFlag };
    }
  }
  return {};
};

const constructApexTestClasses = (apexTestClassesFlag?: string, testLevel?: TTestOption): string[] | undefined => {
  if (!apexTestClassesFlag || testLevel !== RUN_SPECIFIED_TESTS) return undefined;
  try {
    return apexTestClassesFlag.split(',').map((testClass) => testClass.trim());
  } catch (error) {
    throw new SfError(
      `Invalid format for apex-test-classes flag: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

const constructQuickDeploymentComponents = (
  quickDeploymentComponents?: string
): QuickDeploymentComponent[] | undefined => {
  if (!quickDeploymentComponents) return undefined;
  try {
    return JSON.parse(quickDeploymentComponents) as Array<{
      type: string;
      ids: string[];
    }>;
  } catch (error) {
    throw new SfError(
      `Invalid JSON format for metadata-quick-select-components flag: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export { constructApexTestClasses, constructQuickDeploymentComponents, constructQueryFilter };
