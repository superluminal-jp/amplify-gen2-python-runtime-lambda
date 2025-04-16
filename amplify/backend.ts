import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { sayHelloFunctionHandler } from "./custom-functions/say-hello/resource";
import { langChainFunctionHandler } from "./custom-functions/langchain/resource";

import * as iam from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
  auth,
  data,
  sayHelloFunctionHandler,
  langChainFunctionHandler,
});

const statement = new iam.PolicyStatement({
  // effect: "Allow",
  actions: ["bedrock:*"],
  resources: ["*"],
});

backend.langChainFunctionHandler.resources.lambda.addToRolePolicy(statement);
