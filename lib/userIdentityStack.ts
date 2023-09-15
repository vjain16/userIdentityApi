import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';  
import * as iam from "aws-cdk-lib/aws-iam";
import { Function, IFunction, Runtime, Code } from "aws-cdk-lib/aws-lambda";

interface MyProps extends cdk.StackProps {
  envName: string;
  env: any;
}

export class UserIdentityStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MyProps) {
    super(scope, id, props);
    const BUILD_DIR = "./build/";
    const stepFunctionName = "goInstaCareJobSFN";
    const { envName, env} = props;
    const { account, region = "us-east-1" } = env;
    const userPool = new cognito.UserPool(this, 'MyUserPool', {
      selfSignUpEnabled: true, // Enable users to sign up themselves
      signInAliases: { email: true }, // Use email as the sign-in alias
      autoVerify: { email: true }, // Automatically verify email addresses
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
        // Add any other custom attributes you need
      },
    });

    const api = new apigateway.RestApi(this, 'MyApi', {
      deployOptions: {
        stageName: 'dev',
      },
    });

    const myLambda = new nodejs.NodejsFunction(this, 'MyLambda', {
      entry: 'path/to/your/lambda/function',
      handler: 'handler',
      functionName: 'MyLambdaFunctionName',
    });

     /** 1 Action Upcomming Job */
     const initUpcomingJoblambdaFunctionName = `${envName}-init-upcomingJob`;
     const initUpcomingJoblambdaFunction = new Function(
       this,
       `${envName}-init-upcomingJobId`,
       {
         functionName: initUpcomingJoblambdaFunctionName,
         runtime: Runtime.NODEJS_18_X,
         handler: "index.handler", // Assuming your Lambda function is defined in 'index.js'
         code: Code.fromAsset(`${BUILD_DIR}/init`),
         environment: {
           minutesToWaitForAutoSignOut,
           minutesBeforeReminderToBeSent,
         }, // Path to your Lambda code
       }
     );

    const integration = new apigateway.LambdaIntegration(myLambda, {
      proxy: true,
    });
    
    const resource = api.root.addResource('myresource');
resource.addMethod('ANY', integration);

const authorizer = new apigateway.CfnAuthorizer(this, 'MyAuthorizer', {
  restApiId: api.restApiId,
  name: 'MyAuthorizer',
  type: apigateway.AuthorizationType.COGNITO,
  identitySource: 'method.request.header.Authorization',
  providerArns: [userPool.userPoolArn],
});



resource.addMethod('ANY', integration, {
  authorizer: { authorizerId: authorizer.ref },
});

userPool.grant(myLambda);



  }
}
