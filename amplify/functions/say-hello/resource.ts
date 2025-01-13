import { execSync } from "node:child_process";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { defineFunction } from "@aws-amplify/backend";
import { DockerImage, Duration } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";

const functionDir = path.dirname(fileURLToPath(import.meta.url));

export const sayHelloFunctionHandler = defineFunction(
    (scope) =>
        new Function(scope, "say-hello", {
            handler: "index.handler",
            runtime: Runtime.PYTHON_3_12, // or any other python version
            timeout: Duration.seconds(20), //  default is 3 seconds
            code: Code.fromAsset(functionDir, {
                bundling: {
                    image: DockerImage.fromRegistry("dummy"),
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
                            execSync(
                                `rsync -rLv ${functionDir}/* ${path.join(
                                    outputDir
                                )}`
                            );
                            return true;
                        },
                    },
                },
            }),
        })
);
