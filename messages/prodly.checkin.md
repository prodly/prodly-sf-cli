# summary

prodly:checkin command

# examples

- <%= config.bin %> prodly:checkin --target-org test-utxac7gbati9@example.com --target-dev-hub jsmith@acme.com
  Save managed data to the branch associated with the managed instance identified by the target username.
  The instance should be managed by the Prodly account associated with the provided DevHub control org.
- <%= config.bin %> prodly:checkin -u test-utxac7gbati9@example.com
  Save managed data to the branch associated with the managed instance identified by the target username.
  The instance should be managed by the Prodly account associated with the default DevHub control org.
- <%= config.bin %> prodly:checkin -i f50616b6-57b1-4941-802f-ee0e2506f217
  Save managed data to the branch associated with the managed instance identified by the provided ID.
  The instance should be managed by the Prodly account associated with the default DevHub control org.
