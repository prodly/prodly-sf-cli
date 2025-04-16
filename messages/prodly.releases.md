# summary

prodly:releases command

# examples

- <%= config.bin %> prodly:releases --target-dev-hub jsmith@acme.com -l
  Lists all the releases

- <%= config.bin %> prodly:releases --target-dev-hub jsmith@acme.com -d -i "f50616b6-57b1-4941-802f-ee0e2506f217" -r "a5H6e0000024xKUEAY"
  Creates a release given a release id and a destination instance id
  The instance should be managed by the Prodly account associated with the default DevHub control org.
