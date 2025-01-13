import { execSync } from "node:child_process";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { defineFunction } from "@aws-amplify/backend";
import { DockerImage, Duration } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";

// Logging utility
const log = (message: string) =>
    console.log(`[LangChain Deployment]: ${message}`);

const functionDir = path.dirname(fileURLToPath(import.meta.url));

export const langChainFunctionHandler = defineFunction((scope) => {
    try {
        log("Starting to define the LangChain function.");

        return new Function(scope, "langchain", {
            handler: "index.handler",
            runtime: Runtime.PYTHON_3_12, // or any other python version
            timeout: Duration.seconds(20), // default is 3 seconds
            code: Code.fromAsset(functionDir, {
                bundling: {
                    image: DockerImage.fromRegistry("dummy"),
                    local: {
                        tryBundle(outputDir: string) {
                            try {
                                log("Installing Python dependencies...");
                                execSync(
                                    `python3 -m pip install -r ${path.join(
                                        functionDir,
                                        "requirements.txt"
                                    )} -t ${path.join(
                                        outputDir
                                    )} --platform manylinux2014_x86_64 --only-binary=:all:`
                                );
                                log(
                                    "Python dependencies installed successfully."
                                );

                                log("Copying function files...");
                                execSync(
                                    `rsync -rLv ${functionDir}/* ${path.join(
                                        outputDir
                                    )}`
                                );
                                log("Function files copied successfully.");

                                return true;
                            } catch (error) {
                                log(
                                    `Error during bundling: ${
                                        (error as Error).message
                                    }`
                                );
                                throw error; // Re-throw to indicate failure
                            }
                        },
                    },
                },
            }),
        });
    } catch (error) {
        log(`Error in defining function handler: ${(error as Error).message}`);
        throw error; // Re-throw to ensure the error is surfaced appropriately
    }
});
