Command to execute script (This command is based on a custom script from the `package.json` ):

1. npm run cucumberWithTS

NOTE: This command

updated command (This command is triggered through `index.ts` file):

1. npx ts-node src/index.ts smoke
2. npx ts-node src/index.ts regression

NOTE: With above commands we're able to pass specific tag dynamically at runtime through commandline / terminal.

Updated command with simpler approach:

$ npm run cucumber smoke
$ npm run cucumber regression
$ npm run cucumber login
$ npm run cucumber contactus

NOTE: Use `@ignore` tag to ignore any of the test script