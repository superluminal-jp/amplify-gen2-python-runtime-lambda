"use client"; // Enable client-side rendering

import { useState } from "react"; // React hook for state management
import type { Schema } from "../../amplify/data/resource"; // API schema type definition
import { Amplify } from "aws-amplify"; // AWS Amplify for cloud resource interaction
import { generateClient } from "aws-amplify/api"; // Generate API client for Amplify
import outputs from "../../amplify_outputs.json"; // Amplify configuration
import { Flex, Button, TextField } from "@aws-amplify/ui-react"; // Amplify UI components

// Configure Amplify with settings from amplify_outputs.json
Amplify.configure(outputs);

// Generate a typed API client using the defined schema
const client = generateClient<Schema>();

// Main component for the home page
export default function Home() {
  // State to manage user input (name)
  const [name, setName] = useState<string>("John Doe");

  // State to store the response message from the API
  const [message, setMessage] = useState<string>("");

  // Function to call the `sayHello` API endpoint
  const handleSayHello = async () => {
    try {
      // Invoke API query with the user's name
      const response = await client.queries.sayHello({ name });

      // Parse and process the response
      if (response.data) {
        const parsedData = JSON.parse(response.data as string);

        // Extract the message if available
        if (parsedData.body) {
          const responseBody = JSON.parse(parsedData.body as string);
          setMessage(responseBody.message || "No message returned.");
        } else {
          console.error("Response body is missing.");
        }
      } else {
        console.error("Response data is missing.");
      }
    } catch (error) {
      console.error("Error calling sayHelloFunction:", error);
    }
  };

  return (
    <main>
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        wrap="wrap"
      >
        <TextField
          label="Enter Your Name" // Label for the input field
          errorMessage="There is an error" // Error message (for potential validation)
          value={name} // Controlled input value
          placeholder="John Doe" // Default placeholder text
          onChange={(e) => setName(e.target.value)} // Update state on input change
        />
        <Button onClick={handleSayHello}>Hello.</Button>{" "}
        {/* Trigger API call */}
        {message && <p>{message}</p>} {/* Display the response message */}
      </Flex>
    </main>
  );
}
