import { SfError } from '@salesforce/core';
import { expect } from 'chai';
import {
  constructQuickDeploymentComponents,
  constructQuickDeploymentComponentsToDelete,
} from '../../src/helpers/index.js';

describe('constructQuickDeploymentComponents', () => {
  it('returns undefined when no components are given', () => {
    expect(constructQuickDeploymentComponents(undefined)).to.equal(undefined);
  });

  it('parses a JSON array of components', () => {
    expect(
      constructQuickDeploymentComponents(
        '[{"type":"ApexClass","ids":["Foo","Bar"]},{"type":"Profile","ids":["Admin"]}]'
      )
    ).to.deep.equal([
      { type: 'ApexClass', ids: ['Foo', 'Bar'] },
      { type: 'Profile', ids: ['Admin'] },
    ]);
  });

  it('rejects components that are not { type, ids } objects', () => {
    expect(() => constructQuickDeploymentComponents('[{"type":"ApexClass","ids":"Foo"}]')).to.throw(
      SfError,
      'Invalid JSON format for metadata-quick-select-components flag: Expected an array of objects: { type: string; ids: string[] }'
    );
  });
});

describe('constructQuickDeploymentComponentsToDelete', () => {
  it('parses a JSON array of components to delete', () => {
    expect(constructQuickDeploymentComponentsToDelete('[{"type":"ApexClass","ids":["OldClass"]}]')).to.deep.equal([
      { type: 'ApexClass', ids: ['OldClass'] },
    ]);
  });

  it('treats a missing, blank or empty list as no deletions', () => {
    expect(constructQuickDeploymentComponentsToDelete(undefined)).to.equal(undefined);
    expect(constructQuickDeploymentComponentsToDelete('  ')).to.equal(undefined);
    expect(constructQuickDeploymentComponentsToDelete('[]')).to.equal(undefined);
  });

  it('names the delete flag when the JSON is invalid', () => {
    expect(() => constructQuickDeploymentComponentsToDelete('{"type":"ApexClass"}')).to.throw(
      SfError,
      /^Invalid JSON format for metadata-quick-select-components-to-delete flag: /
    );
  });
});
