"use client";
import { useState } from "react";
import { Flex, Button, Text, TextField } from "@aws-amplify/ui-react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../../amplify/data/resource";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function Home() {
    const [isMessage, setIsMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");

    const handleButtonClick = async () => {
        try {
            const response = await client.queries.helloPython({
                name: name || "John Doe", // Use default value if name is empty
            });
            const responseData = JSON.parse(response.data as string);
            console.log(response);
            console.log(responseData);
            setIsMessage(true);
            setMessage(responseData.body);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <Authenticator>
            {({ signOut, user }) => (
                <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                        <Flex direction="column" gap="1rem">
                            <TextField
                                label="Name"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Button onClick={handleButtonClick}>
                                Hello, Python
                            </Button>
                            {isMessage && <Text>{message}</Text>}
                        </Flex>
                    </main>
                </div>
            )}
        </Authenticator>
    );
}
