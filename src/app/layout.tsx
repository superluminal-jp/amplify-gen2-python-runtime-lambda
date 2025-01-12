"use client"; // Ensures this file is treated as client-side in a Next.js application.

import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
// Importing custom Google fonts using Next.js font optimization feature.

import { Authenticator } from "@aws-amplify/ui-react";
// Importing the Authenticator component from AWS Amplify UI library,
// which provides built-in UI for handling authentication.

import { Amplify } from "aws-amplify";
// Importing the Amplify library to configure and interact with AWS Amplify services.

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ToggleSidebarButton from "./components/ToggleSidebarButton";

import "@aws-amplify/ui-react/styles.css";
// Importing default styles for Amplify's UI components to ensure consistent design.

import outputs from "../../amplify_outputs.json";
// Importing the Amplify configuration file, which typically contains AWS-related configurations
// such as API keys, region, user pool details, etc.

import "./globals.css";
// Importing global CSS styles for the application. This is where you can define styles
// that apply to the entire app, like resetting margins, fonts, or body styling.

Amplify.configure(outputs);
// Configuring AWS Amplify using the imported configuration object.
// This step connects your app to the specified AWS resources.

const geistSans = Geist({
    variable: "--font-geist-sans",
    // Defining a CSS custom property for this font, which can be used in your stylesheets.
    subsets: ["latin"],
    // Specifying subsets to limit font file size to only necessary characters.
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    // Defining a CSS custom property for this font, similar to above.
    subsets: ["latin"],
    // Again, restricting to Latin character set.
});

// Exporting the default functional component for the app's layout.
export default function RootLayout({
    children, // The `children` prop represents the child components that will be rendered inside this layout.
}: Readonly<{
    children: React.ReactNode; // Enforcing that `children` is of type ReactNode (React's way of describing what can be rendered).
}>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // Using React's `useState` hook to create a state variable `isSidebarOpen` and its corresponding setter function `setIsSidebarOpen`.
    return (
        <html lang="en">
            {/* The root <html> tag for the document, specifying the language for accessibility and SEO purposes. */}
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                // Adding the custom font variables to the <body> class for global usage.
                // The `antialiased` class smoothens font edges for better readability.
            >
                <Authenticator>
                    {/* The Amplify Authenticator component handles authentication flows such as sign-in, 
                        sign-out, and user session management. */}
                    {
                        ({ signOut, user }) => (
                            // The `Authenticator` component provides a render prop function
                            // that gives access to the `signOut` function and `user` object.
                            <main>
                                <Header onSignOut={() => signOut?.()} />
                                <ToggleSidebarButton
                                    isOpen={isSidebarOpen}
                                    onToggle={() =>
                                        setIsSidebarOpen(!isSidebarOpen)
                                    }
                                />
                                <Sidebar
                                    isOpen={isSidebarOpen}
                                    onClose={() => setIsSidebarOpen(false)}
                                />
                                {children}
                            </main>
                        )
                        // Rendering the child components (passed as `children`) inside the <main> tag.
                    }
                </Authenticator>
            </body>
        </html>
    );
}
