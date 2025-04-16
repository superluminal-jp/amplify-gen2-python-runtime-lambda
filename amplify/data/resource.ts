// Import necessary utilities and types from AWS Amplify backend package
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// Import the handler functions for the "sayHello" and the "langchain" operation from the custom Lambda function
import { sayHelloFunctionHandler } from "../custom-functions/say-hello/resource";
import { langChainFunctionHandler } from "../custom-functions/langchain/resource";

/*
 * Define the schema for the backend API using Amplify's schema utilities.
 * The schema specifies the available operations (queries/mutations) and their configuration.
 */
const schema = a.schema({
  // Define a query operation named "sayHello"
  sayHello: a
    .query() // Specifies that this is a query (read-only operation)
    .arguments({
      // Defines the arguments for the "sayHello" query
      name: a.string(), // The query accepts a single "name" argument of type string
    })
    .returns(a.json()) // Specifies that the query will return a JSON response
    .handler(a.handler.function(sayHelloFunctionHandler))
    // Associates the "sayHello" query with a handler function (the Lambda function "sayHelloFunctionHandler")
    .authorization((allow) => [allow.publicApiKey()]),
  // Sets the authorization mode for the query to allow access via a public API key

  // Define a query operation named "langchain"
  langchain: a
    .query() // Specifies that this is a query (read-only operation)
    .arguments({
      // Defines the arguments for the "sayHello" query
      input: a.string(), // The query accepts a single "name" argument of type string
    })
    .returns(a.json()) // Specifies that the query will return a JSON response
    .handler(a.handler.function(langChainFunctionHandler))
    // Associates the "sayHello" query with a handler function (the Lambda function "sayHelloFunctionHandler")
    .authorization((allow) => [allow.publicApiKey()]),
  // Sets the authorization mode for the query to allow access via a public API key
});

// Export the schema type to make it accessible in other parts of the application
export type Schema = ClientSchema<typeof schema>;

// Define the backend data model using the schema and authorization modes
export const data = defineData({
  schema, // Attach the schema defined above
  authorizationModes: {
    defaultAuthorizationMode: "apiKey", // Set the default authorization mode to use an API key
  },
});
