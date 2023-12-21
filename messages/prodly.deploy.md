# summary

prodly:deploy command

# examples

- <%= config.bin %> prodly:deploy -n scratchorg -u FixesScratchOrg -v MainDevHub
  Command output... deploying from the dev hub, the control org, to the scratch org, auto managed with provided name.
  Command output...
- <%= config.bin %> prodly:deploy --target-org test-utxac7gbati9@example.com --target-dev-hub jsmith@acme.com
  Command output... deploying from the dev hub, the control org, to the scratch org. Long param names.
- <%= config.bin %> prodly:deploy -u test-utxac7gbati9@example.com -v jsmith@acme.com -d "UAT Sandbox Connection"
  Command output... deploying from the scratch org to the UAT sandbox, using the named connection record in the dev hub, control org.
- <%= config.bin %> prodly:deploy --target-org test-utxac7gbati9@example.com --target-dev-hub jsmith@acme.com --source "UAT Sandbox Connection"
  Command output... deploying to the scratch org from the UAT sandbox, using the named connection record in the dev hub, control org. Long param names.
