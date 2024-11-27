# summary

prodly:change-types command

# examples

- <%= config.bin %> prodly:change-types --target-dev-hub jsmith@acme.com -l
  Lists all the change types

- <%= config.bin %> prodly:change-types --target-dev-hub jsmith@acme.com -l -t a1h3t00000JN9lhAAD
  Lists a specific change type

- <%= config.bin %> prodly:change-types --target-dev-hub jsmith@acme.com -c -n "SO FROM CLI" -u "username@example.com" -t a1h3t00000JN9lhAAD
  Creates a scratch org based on a change type
