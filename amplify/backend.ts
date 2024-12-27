import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { HelloPythonStack } from "./custom-functions/hello-python/resource";

const backend = defineBackend({
    auth,
    data,
});

new HelloPythonStack(
    backend.createStack("HelloPythonStack"),
    "HelloPythonStack",
    {}
);
