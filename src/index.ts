import {exec} from 'child_process';

//Define a common command string for running cucumber tests
const common = `./src/features/*.feature \
  --require-module ts-node/register \
  --require ./src/step-definitions/**/**/*.ts \
  --require ./src/utils/cucumber-timeout.ts \
  -f json:./reports/report.json \
  --format html:./reports/report.html \
  --tags "not @ignore"`;

//Define an interface for the profiles object
//It defines an interface where each key is a string and its value is also a string
interface ProfileCommands {
    [key: string]: string;
}

//Define a command strings for different test profiles
const profiles: ProfileCommands = {
    smoke: `${common} --tags "@smoke"`,
    regression: `${common} --tags "@regression"`,
    login: `${common} --tags "@login"`,
    contactus: `${common} --tags "@contactus"`,
}

//Get the third command-line argument and assign it to the profile
//i.e. smoke, regression etc
const profile = process.argv[2];

//Construct the command string based on the selected profile
//command is the full command to run the tests for the selected profile
let command = `npx cucumber-js ${profiles[profile as 'smoke' | 'regression' | 'login' | 'contactus']}`;

//Print the constructed command
//console.log(command);

//Execute the constructed command using child_process.exec
exec(command, { encoding: 'utf-8'}, (error: Error | null, stdout: string) =>{
  //Log the output of the command
  console.log(stdout);

  //check if there was an error during execution
  if(error) {
    //throw a new error with a simple message
    throw new Error('⚠️ 💥 Some automation test(s) have failed! - Please review. ⚠️ 💥')
  }
});