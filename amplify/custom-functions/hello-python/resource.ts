import { CfnOutput, Stack, StackProps, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";

export class HelloPythonStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // Create Log Group
        const helloPythonLogs = new logs.LogGroup(this, "HelloPythonLogGroup", {
            logGroupName: "/aws/lambda/hello-python-function",
            retention: logs.RetentionDays.ONE_WEEK,
        });

        // Define the Lambda function
        const helloPythonFunction = new lambda.Function(
            this,
            "HelloPythonFunction",
            {
                runtime: lambda.Runtime.PYTHON_3_12,
                handler: "index.handler", // "index" is the filename and "handler" is the function name in the file
                code: lambda.Code.fromAsset(
                    "./amplify/custom-functions/hello-python"
                ),
                functionName: "hello-python-function",
                description: "Simple Python Lambda function",
                timeout: Duration.seconds(30),
                memorySize: 128,
                logGroup: helloPythonLogs,
                environment: {
                    LOG_LEVEL: "INFO",
                },
            }
        );

        // Output the Lambda function ARN
        new CfnOutput(this, "HelloPythonFunctionArn", {
            value: helloPythonFunction.functionArn,
            exportName: "hello-python-function-arn",
        });
    }
}
