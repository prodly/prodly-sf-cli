# summary

prodly:manage command

# examples

- <%= config.bin %> prodly:manage -l -p
  List and print all of the managed instances for the Prodly account associated with the default DevHub control org.
- <%= config.bin %> prodly:manage -m --target-org test-utxac7gbati9@example.com --target-dev-hub jsmith@acme.com
  Manage the org associated with the target username under the Prodly account associated with the provided DevHub control org.
- <%= config.bin %> prodly:manage -m -u test-utxac7gbati9@example.com -n dev7sbx
  Manage and version the org associated with the target username under the Prodly account associated with the default DevHub control org.
