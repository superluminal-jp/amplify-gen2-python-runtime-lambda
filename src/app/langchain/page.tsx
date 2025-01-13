"use client"; // Enable client-side rendering

import { useState } from "react"; // React hook for state management
import type { Schema } from "../../../amplify/data/resource"; // API schema type definition
import { Amplify } from "aws-amplify"; // AWS Amplify for cloud resource interaction
import { generateClient } from "aws-amplify/api"; // Generate API client for Amplify
import outputs from "../../../amplify_outputs.json"; // Amplify configuration
import { Flex, Button, TextField, Text } from "@aws-amplify/ui-react"; // Amplify UI components

// Configure Amplify with settings from amplify_outputs.json
Amplify.configure(outputs);

// Generate a typed API client using the defined schema
const client = generateClient<Schema>();

export default function LangChainPage() {
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");
    const handleClick = async () => {
        try {
            const response = await client.queries.langchain({ input });
            console.log("Langchain API response:", response);

            const data = JSON.parse(response.data as string);
            console.log("Parsed data:", data);

            const body = data.body;
            console.log("Body:", body);

            setOutput(body);
        } catch (error) {
            console.error("Error calling langchain API:", error);
        }
    };

    return (
        <main>
            <Flex
                direction="column"
                alignItems="center"
                justifyContent="center"
                gap="1rem"
            >
                <TextField
                    onChange={(e) => setInput(e.target.value)}
                    label="Input"
                />
                <Button onClick={handleClick}>Translate</Button>
                {output && <Text>{output}</Text>}
            </Flex>
        </main>
    );
}
