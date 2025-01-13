import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { sayHelloFunctionHandler } from "../functions/say-hello/resource";

const schema = a.schema({
    sayHello: a
        .query()
        .arguments({
            name: a.string(),
        })
        .returns(a.json())
        .handler(a.handler.function(sayHelloFunctionHandler))
        .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: "apiKey",
    },
});
