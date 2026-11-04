# summary

prodly:checkout command

# examples

- <%= config.bin %> prodly:checkout --target-org test-utxac7gbati9@example.com --target-dev-hub jsmith@acme.com
  Deploy managed data to the managed instance identified by the target org from the associated branch.
  The instance should be managed by the Prodly account associated with the provided DevHub control org.
- <%= config.bin %> prodly:checkout --target-org test-utxac7gbati9@example.com
  Deploy managed data to the managed instance org identified by the target username from the associated branch.
  The instance should be managed by the Prodly account associated with the default DevHub control org.
- <%= config.bin %> prodly:checkout -i f50616b6-57b1-4941-802f-ee0e2506f217
  Deploy managed data to the managed instance org from the associated branch.
  The instance should be managed by the Prodly account associated with the default DevHub control org.
- <%= config.bin %> prodly:checkout -i f50616b6-57b1-4941-802f-ee0e2506f217 --name "Remove old classes" --metadata-quick-select-components-to-delete '[{"type":"ApexClass","ids":["OldClass"]}]' --destructive-changes-order post
  Delete metadata from the managed instance org, after deploying any other quick select components.
  Members already missing from the org are skipped. The metadata destructive changes setting must be enabled in Prodly.
