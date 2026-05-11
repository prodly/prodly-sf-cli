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
    const segments = apexTestClassesFlag.split(',');
    const trimmed = segments.map((testClass) => testClass.trim());
    const hasEmptySegment = trimmed.some((testClass) => testClass.length === 0);
    const parsed = trimmed.filter((testClass) => testClass.length > 0);

    if (parsed.length === 0) {
      throw new Error('Provide at least one Apex test class when RunSpecifiedTests is selected.');
    }
    if (hasEmptySegment) {
      throw new Error(
        'apex-test-classes cannot include empty entries (remove trailing commas, duplicate commas, or whitespace-only segments).'
      );
    }

    return parsed;
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
    const parse = JSON.parse(quickDeploymentComponents) as QuickDeploymentComponent[];
    const isValid =
      Array.isArray(parse) &&
      parse.every(
        (item) =>
          item &&
          typeof item === 'object' &&
          typeof item.type === 'string' &&
          Array.isArray(item.ids) &&
          item.ids.every((id) => typeof id === 'string')
      );
    if (!isValid) {
      throw new Error('Expected an array of objects: { type: string; ids: string[] }');
    }
    return parse;
  } catch (error) {
    throw new SfError(
      `Invalid JSON format for metadata-quick-select-components flag: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export { constructApexTestClasses, constructQuickDeploymentComponents, constructQueryFilter };
