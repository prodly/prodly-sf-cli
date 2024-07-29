# summary

prodly:checkout command

# examples

- <%= config.bin %> prodly:checkout --target-org test-utxac7gbati9@example.com --target-dev-hub jsmith@acme.com
  Deploy managed data to the managed instance identified by the target org from the associated branch..
  The instance should be managed by the Prodly account associated with the provided DevHub control org.
- <%= config.bin %> prodly:checkout -u test-utxac7gbati9@example.com
  Deploy managed data to the managed instance org identified by the target username from the associated branch.
  The instance should be managed by the Prodly account associated with the default DevHub control org.
- <%= config.bin %> prodly:checkout -i f50616b6-57b1-4941-802f-ee0e2506f217
  Deploy managed data to the managed instance org from the associated branch.
  The instance should be managed by the Prodly account associated with the default DevHub control org.
