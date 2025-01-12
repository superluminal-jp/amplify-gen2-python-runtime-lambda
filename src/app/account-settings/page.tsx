"use client";

import { useState, useEffect } from "react";
import {
    AccountSettings,
    Divider,
    Heading,
    View,
    Text,
    Button,
    Input,
    Table,
    TableCell,
    TableBody,
    TableHead,
    TableRow,
    useTheme,
} from "@aws-amplify/ui-react";
import {
    fetchUserAttributes,
    updateUserAttribute,
    confirmUserAttribute,
    sendUserAttributeVerificationCode,
    type VerifiableUserAttributeKey,
} from "aws-amplify/auth";

export default function AccountSettingsPage() {
    // ==================== State Management ====================
    const [userAttributes, setUserAttributes] = useState<
        Record<string, string>
    >({});
    const [newEmail, setNewEmail] = useState("");
    const [newName, setNewName] = useState("");
    const [confirmationCode, setConfirmationCode] = useState("");
    const [currentAttributeKey, setCurrentAttributeKey] = useState<
        string | null
    >(null);
    const [loading, setLoading] = useState(false);
    const [globalMessage, setGlobalMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [emailMessage, setEmailMessage] = useState<string | null>(null);
    const [nameMessage, setNameMessage] = useState<string | null>(null);
    const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

    const { tokens } = useTheme();

    // ==================== Event Handlers ====================
    const fetchAttributes = async () => {
        setLoading(true);
        setGlobalMessage(null);
        try {
            const data = await fetchUserAttributes();
            const attributes = Object.entries(data || {}).reduce<
                Record<string, string>
            >((acc, [key, value]) => {
                if (value !== undefined && value !== null) {
                    acc[key] = String(value);
                }
                return acc;
            }, {});
            setUserAttributes(attributes);
        } catch (error) {
            console.error("Error fetching user attributes:", error);
            setGlobalMessage({
                type: "error",
                text: "Failed to fetch user attributes.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateAttribute = async (
        key: string,
        value: string,
        setMessage: React.Dispatch<React.SetStateAction<string | null>>
    ) => {
        if (!value.trim()) {
            setMessage(`${key} cannot be empty.`);
            return;
        }
        setLoading(true);
        setMessage(null);
        try {
            const result = await updateUserAttribute({
                userAttribute: { attributeKey: key, value },
            });
            if (
                result.nextStep.updateAttributeStep ===
                "CONFIRM_ATTRIBUTE_WITH_CODE"
            ) {
                setCurrentAttributeKey(key);
                setMessage(
                    `A confirmation code has been sent to your ${key}. Please enter it below.`
                );
            } else {
                setMessage(`${key} updated successfully.`);
            }
            fetchAttributes();
        } catch (error) {
            setMessage(`Failed to update ${key}.`);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmAttribute = async () => {
        if (!currentAttributeKey || !confirmationCode.trim()) {
            setEmailMessage("Confirmation code is required.");
            return;
        }
        setLoading(true);
        setEmailMessage(null);
        try {
            await confirmUserAttribute({
                userAttributeKey:
                    currentAttributeKey as VerifiableUserAttributeKey,
                confirmationCode,
            });
            setEmailMessage(`${currentAttributeKey} confirmed successfully.`);
            setCurrentAttributeKey(null);
            setConfirmationCode("");
            fetchAttributes();
        } catch (error) {
            setEmailMessage("Failed to confirm attribute.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        setPasswordMessage("Your password has been updated successfully.");
    };

    // ==================== Lifecycle ====================
    useEffect(() => {
        fetchAttributes();
    }, []);

    // ==================== Render ====================
    return (
        <main>
            <Heading level={1}>Account Settings</Heading>

            {/* グローバルメッセージ */}
            {globalMessage && (
                <Text>{globalMessage.text}</Text>
            )}
            {loading && <Text>Loading...</Text>}

            {/* User Attributes */}
            <View>
                <Heading level={2}>User Attributes</Heading>
                <Table variation="bordered">
                    <TableHead>
                        <TableRow>
                            <TableCell as="th">Attribute</TableCell>
                            <TableCell as="th">Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(userAttributes).map(([key, value]) => (
                            <TableRow key={key}>
                                <TableCell>{key}</TableCell>
                                <TableCell>{value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </View>

            <Divider
                orientation="horizontal"
                style={{ margin: `${tokens.space.large} 0` }}
            />

            {/* Update Email */}
            <Heading level={2}>Update Email</Heading>
            <View>
                <Input
                    type="email"
                    placeholder="New Email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                />
                <Button
                    onClick={() =>
                        handleUpdateAttribute(
                            "email",
                            newEmail,
                            setEmailMessage
                        )
                    }
                    isDisabled={loading}
                >
                    Update Email
                </Button>
                {emailMessage && <Text>{emailMessage}</Text>}
            </View>

            <Divider
                orientation="horizontal"
                style={{ margin: `${tokens.space.large} 0` }}
            />

            {/* Update Name */}
            <Heading level={2}>Update Name</Heading>
            <View>
                <Input
                    type="text"
                    placeholder="New Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <Button
                    onClick={() =>
                        handleUpdateAttribute("name", newName, setNameMessage)
                    }
                    isDisabled={loading}
                >
                    Update Name
                </Button>
                {nameMessage && <Text>{nameMessage}</Text>}
            </View>

            {/* Confirm Attribute */}
            {currentAttributeKey && (
                <View>
                    <Heading level={3}>Confirm {currentAttributeKey}</Heading>
                    <Input
                        type="text"
                        placeholder="Enter confirmation code"
                        value={confirmationCode}
                        onChange={(e) => setConfirmationCode(e.target.value)}
                    />
                    <Button
                        onClick={handleConfirmAttribute}
                        isDisabled={loading}
                    >
                        Confirm
                    </Button>
                    {emailMessage && (
                        <Text>{emailMessage}</Text>
                    )}
                </View>
            )}

            <Divider
                orientation="horizontal"
                style={{ margin: `${tokens.space.large} 0` }}
            />

            {/* Update Password */}
            <Heading level={2}>Update Password</Heading>
            <View>
                <AccountSettings.ChangePassword
                    onSuccess={handleUpdatePassword}
                />
                {passwordMessage && (
                    <Text>{passwordMessage}</Text>
                )}
            </View>

            <Divider
                orientation="horizontal"
                style={{ margin: `${tokens.space.large} 0` }}
            />

            {/* Delete User */}
            <Heading level={2}>Delete Account</Heading>
            <AccountSettings.DeleteUser />
        </main>
    );
}
