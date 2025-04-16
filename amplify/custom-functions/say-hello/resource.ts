import { execSync } from "node:child_process";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { defineFunction } from "@aws-amplify/backend";
import { DockerImage, Duration, Stack } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";

const functionDir = path.dirname(fileURLToPath(import.meta.url));

export const sayHelloFunctionHandler = defineFunction(
  (scope) => {
    // Get the stack name and use it to determine the function name
    // This is to ensure that the function name is unique across different stacks
    const stackName = Stack.of(scope).stackName || "";
    const functionName = stackName.includes("sandbox")
      ? "sayHello-sandbox"
      : "sayHello";

    return new Function(scope, functionName, {
      handler: "index.handler",
      runtime: Runtime.PYTHON_3_12, // or any other python version
      timeout: Duration.seconds(300), //  default is 3 seconds
      code: Code.fromAsset(functionDir, {
        bundling: {
          image: DockerImage.fromRegistry("dummy"), // replace with desired image from AWS ECR Public Gallery
          local: {
            tryBundle(outputDir: string) {
              execSync(
                `python3 -m pip install -r ${path.join(
                  functionDir,
                  "requirements.txt"
                )} -t ${path.join(
                  outputDir
                )} --platform manylinux2014_x86_64 --only-binary=:all:`
              );
              execSync(`cp -r ${functionDir}/* ${path.join(outputDir)}`);
              return true;
            },
          },
        },
      }),
    });
  },
  {
    resourceGroupName: "auth", // Optional: Groups this function with auth resource
  }
);
