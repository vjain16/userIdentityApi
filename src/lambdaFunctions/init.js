// Import the required AWS SDK modules
const { SFNClient, StartExecutionCommand } = require("@aws-sdk/client-sfn");

exports.handler = async (event, context) => {
  console.log(" event ", JSON.stringify(event));
  console.log(" Context", JSON.stringify(context));
  const accountId = context.invokedFunctionArn.split(":")[4];
  // Create an instance of the notifier Functions client
  const region = process.env.AWS_REGION;
  const sfnClient = new SFNClient({ region });
  const { id, jobDateTime, status, duration } = event;
  const { envName } = process.env;
  const stateMachineArn = `arn:aws:states:${region}:${accountId}:stateMachine:${envName}-goInstaCareStepFunction`;
  console.log(" State Machine ARN ", stateMachineArn);
  const input = JSON.stringify({
    id,
    jobDateTime,
    status,
    duration,
  }); // Provide input data if needed

  const params = {
    stateMachineArn: stateMachineArn,
    input: input,
  };
  // Construct the StartExecutionCommand
  const startExecutionParams = {
    stateMachineArn: stateMachineArn,
    input: JSON.stringify(input), // Convert input object to JSON string
  };

  try {
    // Call the StartExecutionCommand to initiate the notifier Function execution
    const data = await sfnClient.send(
      new StartExecutionCommand(startExecutionParams)
    );
    console.log("notifier Function execution started:", data.executionArn);

    // You can return a response from the Lambda function if needed
    return {
      statusCode: 200,
      body: JSON.stringify(
        "notifier Function execution started: " + data.executionArn
      ),
    };
  } catch (error) {
    console.error("Error starting notifier Function execution:", error);
    throw error; // Rethrow the error to be handled by Lambda error handling
  }
};
