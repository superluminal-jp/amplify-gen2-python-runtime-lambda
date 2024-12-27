import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
    helloPython: a
        .query()
        .arguments({
            name: a.string(),
        })
        .returns(a.json())
        .authorization((allow) => allow.publicApiKey())
        .handler(a.handler.function(`hello-python-function`)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: "apiKey",
        apiKeyAuthorizationMode: {
            expiresInDays: 30,
        },
    },
});
