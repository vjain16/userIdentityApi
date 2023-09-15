# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## notifier function will take the input as

{
"id": "758a3395-1810-4d75-974f-e565c8e4ca74",
"jobDateTime": "2023-08-14T08:27:00.000Z",
"status": "RequestPending",
"duration": 90 (mins)
}

## Project Deploy

- npm run deploy ( To Clean , Compile build lambda and deploy project )
- npm run build ( To clean , compile and build lambda )
- npm run bundle-lambda ( to compile and build lambda )
