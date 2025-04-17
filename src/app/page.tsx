"use client";

import React, { useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import awsConfig from "../../amplify_outputs.json";
import { Flex, Button, TextField, View, Heading } from "@aws-amplify/ui-react";

// Configure Amplify
Amplify.configure(awsConfig);

// Typed API client
const client = generateClient<Schema>();

const Home: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a name.");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const response = await client.queries.sayHello({ name });
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
      setMessage(body.message ?? "");
    } catch (err: unknown) {
      console.error("Error in sayHello:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        gap="1rem"
        padding="2rem"
      >
        <Heading level={2}>Say Hello</Heading>
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 400 }}>
          <TextField
            label="Name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            hasError={Boolean(error)}
            errorMessage={error}
            autoComplete="off"
            required
          />
          <Button type="submit" isLoading={loading} isDisabled={loading}>
            {loading ? "Loading..." : "Say Hello"}
          </Button>
        </form>
        {message && <View>{message}</View>}
      </Flex>
    </main>
  );
};

export default Home;
