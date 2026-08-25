import salesforceTypescript from 'eslint-config-salesforce-typescript';
import sfPlugin from 'eslint-plugin-sf-plugin';

export default [
  ...salesforceTypescript,
  ...sfPlugin.configs.recommended,
  {
    rules: {
      // This is not a Salesforce-owned repo, so don't require the Salesforce copyright header.
      'header/header': 'off',
    },
  },
];
