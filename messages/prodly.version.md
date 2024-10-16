# summary

prodly:version command

# examples

- <%= config.bin %> prodly:version -s main
  Add version control to the managed instance identified by the target org. Use the "main" branch.
  The instance should be managed by the Prodly account associated with the default DevHub control org.
- <%= config.bin %> prodly:version -s main -b cli-branch -i f50616b6-57b1-4941-802f-ee0e2506f217  
  Add version control to the managed instance identified by the provided ID. Use the "main" branch as a base for a new branch called "cli-branch"
  The instance should be managed by the Prodly account associated with the default DevHub control org.
- <%= config.bin %> prodly:version -x -i f50616b6-57b1-4941-802f-ee0e2506f217
  Remove version control from the managed instance identified by the provided ID.
  The instance should be managed by the Prodly account associated with the default DevHub control org.
