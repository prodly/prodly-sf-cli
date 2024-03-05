# prodlysfcli

[![NPM](https://img.shields.io/npm/v/prodlysfcli.svg?label=prodlysfcli)](https://www.npmjs.com/package/prodlysfcli) [![Downloads/week](https://img.shields.io/npm/dw/prodlysfcli.svg)](https://npmjs.org/package/prodlysfcli) [![License](https://img.shields.io/badge/License-BSD%203--Clause-brightgreen.svg)](https://raw.githubusercontent.com/salesforcecli/prodlysfcli/main/LICENSE.txt)

## Install

```bash
sf plugins install prodlysfcli@x.y.z
```

## Issues

Please report any issues at https://github.com/prodly/prodly-sf-cli/issues

### Build

To build the plugin locally, make sure to have yarn installed and run the following commands:

```bash
# Clone the repository
git clone https://github.com/prodly/prodly-sf-cli.git

# Install the dependencies and compile
yarn && yarn build
```

```bash
# Run using local run file.
./bin/run.js prodly:manage -l -p
```

There should be no differences when running via the Salesforce CLI or using the local run file. However, it can be useful to link the plugin to do some additional testing or run your commands from anywhere on your machine.

```bash
# Link your plugin to the sf cli
sf plugins link .
# To verify
sf plugins
```

## Commands

<!-- commands -->

- [`sf prodly:checkin`](#sf-prodlycheckin)
- [`sf prodly:checkout`](#sf-prodlycheckout)
- [`sf prodly:deploy`](#sf-prodlydeploy)
- [`sf prodly:manage`](#sf-prodlymanage)
- [`sf prodly:jobs`](#sf-prodlyjobs)

## `sf prodly:checkin`

```
USAGE
  $ sf prodly:checkin -v <value> -o <value> [--json] [-b <value>] [-c <value>] [-t <value>] [-i <value>] [-z
    <value>] [-p <value>]

FLAGS
  -b, --branch=<value>          branch name for deployment
  -c, --comment=<value>         comment for the command versioning commit
  -i, --instance=<value>        managed instance ID on which to perform the action
  -o, --target-org=<value>      (required) Username or alias of the target org. Not
                                required if the `target-org` configuration variable is already set.
  -p, --plan=<value>            name or record ID of the deployment plan to deploy
  -t, --dataset=<value>         name or record ID of the data set to deploy
  -v, --target-dev-hub=<value>  (required) Username or alias of the Dev Hub org. Not
                                required if the `target-dev-hub` configuration variable is already set.
  -z, --notes=<value>           notes for the deployment

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  prodly:checkin command

  Launches an Prodly relational data deployment.

EXAMPLES
  $ sf prodly:checkin --target-org test-utxac7gbati9@example.com --target-dev-hub jsmith@acme.com
  Save managed data to the branch associated with the managed instance identified by the target username.
  The instance should be managed by the Prodly account associated with the provided DevHub control org.

  $ sf prodly:checkin -u test-utxac7gbati9@example.com
  Save managed data to the branch associated with the managed instance identified by the target username.
  The instance should be managed by the Prodly account associated with the default DevHub control org.

  $ sf prodly:checkin -i f50616b6-57b1-4941-802f-ee0e2506f217
  Save managed data to the branch associated with the managed instance identified by the provided ID.
  The instance should be managed by the Prodly account associated with the default DevHub control org.
```

## `sf prodly:checkout`

```
USAGE
  $ sf prodly:checkout -v <value> -o <value> [--json] [-b <value>] [-t <value>] [-e] [-i <value>] [-n <value>] [-z
    <value>] [-p <value>]

FLAGS
  -b, --branch=<value>          branch name for deployment
  -e, --deactivate              deactivate all events for the deployment
  -i, --instance=<value>        managed instance ID on which to perform the action
  -n, --name=<value>            name for the deployment
  -o, --target-org=<value>      (required) Username or alias of the target org. Not
                                required if the `target-org` configuration variable is already set.
  -p, --plan=<value>            name or record ID of the deployment plan to deploy
  -t, --dataset=<value>         name or record ID of the data set to deploy
  -v, --target-dev-hub=<value>  (required) Username or alias of the Dev Hub org. Not
                                required if the `target-dev-hub` configuration variable is already set.
  -z, --notes=<value>           notes for the deployment

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  prodly:checkout command

  Launches an Prodly relational data deployment.

EXAMPLES
  $ sf prodly:checkin --target-org test-utxac7gbati9@example.com --target-dev-hub jsmith@acme.com
  Save managed data to the branch associated with the managed instance identified by the target username.
  The instance should be managed by the Prodly account associated with the provided DevHub control org.

  $ sf prodly:checkin -u test-utxac7gbati9@example.com
  Save managed data to the branch associated with the managed instance identified by the target username.
  The instance should be managed by the Prodly account associated with the default DevHub control org.

  $ sf prodly:checkin -i f50616b6-57b1-4941-802f-ee0e2506f217
  Save managed data to the branch associated with the managed instance identified by the provided ID.
  The instance should be managed by the Prodly account associated with the default DevHub control org.
```

## `sf prodly:deploy`

```
USAGE
  $ sf prodly:deploy -v <value> -o <value> [--json] [-t <value>] [-e] [-d <value>] [-q <value>] [-b <value>] [-n
    <value>] [-z <value>] [-p <value>] [-l] [-s <value>]

FLAGS
  -b, --label=<value>           connection and managed instance name
  -d, --destination=<value>     destination managed instance ID
  -e, --deactivate              deactivate all events for the deployment
  -l, --simulation              perform a data simulation
  -n, --name=<value>            name for the deployment
  -o, --target-org=<value>      (required) Username or alias of the target org. Not
                                required if the `target-org` configuration variable is already set.
  -p, --plan=<value>            name or record ID of the deployment plan to deploy
  -q, --filter=<value>          query filter override for a data set deployment
  -s, --source=<value>          source managed instance ID
  -t, --dataset=<value>         name or record ID of the data set to deploy
  -v, --target-dev-hub=<value>  (required) Username or alias of the Dev Hub org. Not
                                required if the `target-dev-hub` configuration variable is already set.
  -z, --notes=<value>           notes for the deployment

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  prodly:deploy command

  Launches an Prodly relational data deployment.

EXAMPLES
  $ sf prodly:deploy -n scratchorg -u FixesScratchOrg -v MainDevHub
  Command output... deploying from the dev hub, the control org, to the scratch org, auto managed with provided name.
  Command output...

  $ sf prodly:deploy --target-org test-utxac7gbati9@example.com --target-dev-hub jsmith@acme.com
  Command output... deploying from the dev hub, the control org, to the scratch org. Long param names.

  $ sf prodly:deploy -u test-utxac7gbati9@example.com -v jsmith@acme.com -d "UAT Sandbox Connection"
  Command output... deploying from the scratch org to the UAT sandbox, using the named connection record in the dev hub, control org.

  $ sf prodly:deploy --target-org test-utxac7gbati9@example.com --target-dev-hub jsmith@acme.com --source "UAT Sandbox Connection"
  Command output... deploying to the scratch org from the UAT sandbox, using the named connection record in the dev hub, control org. Long param names.
```

## `sf prodly:manage`

```
USAGE
  $ sf prodly:manage -v <value> -o <value> [--json] [-c <value>] [-n <value>] [-i <value>] [-b <value>] [-l] [-m]
    [-p] [-x] [-s]

FLAGS
  -b, --label=<value>           connection and managed instance name
  -c, --comment=<value>         comment for the command versioning commit
  -i, --instance=<value>        managed instance ID on which to perform the action
  -l, --list                    list all managed instances
  -m, --manage                  manage a new instance
  -n, --connection=<value>      connection to use for the managed instance
  -o, --target-org=<value>      (required) Username or alias of the target org. Not
                                required if the `target-org` configuration variable is already set.
  -p, --print                   print the managed instances in a standard format in addition to returning structured
                                data
  -s, --version                 version the new managed instance, branch created and data deployed to the org
  -v, --target-dev-hub=<value>  (required) Username or alias of the Dev Hub org. Not
                                required if the `target-dev-hub` configuration variable is already set.
  -x, --unmanage                unmanage the specified instance

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  prodly:manage command

  Launches an Prodly relational data deployment.

EXAMPLES
  $ sf prodly:manage -l -p
  List and print all of the managed instances for the Prodly account associated with the default DevHub control org.

  $ sf prodly:manage -m --target-org test-utxac7gbati9@example.com --target-dev-hub jsmith@acme.com
  Manage the org associated with the target username under the Prodly account associated with the provided DevHub control org.

  $ sf prodly:manage -m -u test-utxac7gbati9@example.com -n dev7sbx
  Manage and version the org associated with the target username under the Prodly account associated with the default DevHub control org.

```

## `sf prodly:jobs`

```
USAGE
  $ sf prodly jobs -v <value> -j <value> [--json]

FLAGS
  -j, --job=<value>             (required) Prodly Job ID
  -v, --target-dev-hub=<value>  (required) Username or alias of the Dev Hub org.
                                Not required if the `target-dev-hub` configuration variable is already set.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  prodly:jobs command

  Launches an Prodly relational data deployment.

EXAMPLES
  $ sf prodly:jobs -j jobId -v MainDevHub
  Print the job status for the provided job Id.
```

<!-- commandsstop -->

<!-- debugging-your-plugin -->

# Debugging your plugin

We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `prodly:manage -l -p` command:

1. Start the inspector

Call your command using the `bin/run.js` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:

```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run.js prodly:manage -l -p
```

2. Set some breakpoints in your command code
3. Click on the Run and Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach" launch configuration window. The debugger should now be suspended on the first line of the program.
6. Hit the blue play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
   <br><img src=".images/vscodeScreenshot.png" width="600" height="343"><br>
   Congrats, you are debugging!
