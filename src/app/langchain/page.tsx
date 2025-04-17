"use client"; // Enable client-side rendering

import { useState } from "react"; // React hook for state management
import type { Schema } from "../../../amplify/data/resource"; // API schema type definition
import { Amplify } from "aws-amplify"; // AWS Amplify for cloud resource interaction
import { generateClient } from "aws-amplify/api"; // Generate API client for Amplify
import outputs from "../../../amplify_outputs.json"; // Amplify configuration
import { Flex, Button, TextField, Text, View } from "@aws-amplify/ui-react"; // Amplify UI components

// Configure Amplify with settings from amplify_outputs.json
Amplify.configure(outputs);

// Generate a typed API client using the defined schema
const client = generateClient<Schema>();

export default function LangChainPage() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick = async () => {
    if (!input.trim()) {
      setError("Please enter text to translate");
      return;
    }

    setError("");
    setOutput("");
    setLoading(true);

    try {
      const response = await client.queries.langchain({ input });
      console.log("Langchain API response:", response);

      if (response.errors?.length) {
        throw new Error(response.errors.map((err) => err.message).join(", "));
      }

      const payload = response.data as
        | { statusCode: number; body: string }
        | undefined;
      if (!payload) {
        throw new Error("Empty response from server.");
      }

      const action =
        typeof payload === "string" ? JSON.parse(payload) : payload;
      const body =
        typeof action.body === "string" ? JSON.parse(action.body) : action.body;
      console.log("Processed response:", body);

      setOutput(body);
    } catch (error) {
      console.error("Error calling langchain API:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap="1rem"
        padding="2rem"
      >
        <TextField
          onChange={(e) => setInput(e.target.value)}
          label="Enter text to translate"
          placeholder="Type in English or Japanese"
          value={input}
          hasError={Boolean(error)}
          errorMessage={error}
          autoComplete="off"
        />
        <Button onClick={handleClick} isLoading={loading} isDisabled={loading}>
          {loading ? "Translating..." : "Translate"}
        </Button>
        {error && <Text variation="error">{error}</Text>}
        {output && (
          <View
            padding="1rem"
            backgroundColor="var(--amplify-colors-background-secondary)"
          >
            <Text>{output}</Text>
          </View>
        )}
      </Flex>
    </main>
  );
}
