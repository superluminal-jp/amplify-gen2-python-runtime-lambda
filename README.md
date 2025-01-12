# Amplify + Next.js Account Settings Application

This project is a Next.js App Router application integrated with AWS Amplify Gen 2 that provides a complete solution for user account management. AWS Amplify Gen 2 leverages AWS Cognito for user authentication and offers a responsive and user-friendly interface for managing account settings. This application showcases how to implement common account management features such as updating user attributes, confirming attribute changes via verification codes, password updates, and account deletion. See [AWS Amplify Gen 2](https://docs.amplify.aws/nextjs/build-a-backend/auth/) for more information.

# <Authenticator> Component

Sign-in, Sign-out, and Create Account features are provided by `<Authenticator>` component which is implemented in `src/app/layout.tsx` in this project. See [AWS Amplify Gen 2 Authenticator](https://docs.amplify.aws/nextjs/build-a-backend/auth/connect-your-frontend/using-the-authenticator/) for more information.

# Account Setting Page

The account setting page is implemented in `src/app/account-settings/page.tsx`. In this page, 4 features are implemented:

1. View and Manage User Attributes
2. Update User Information (email, username)
3. Confirmation Code Handling
4. Password Management
5. Account Deletion

# Key Features

1. User Authentication
    - Users can sign up, sign in, and manage sessions securely using AWS Cognito.
    - Amplify’s Authenticator component handles all authentication flows (sign-up, sign-in, and multi-factor authentication if enabled).
2. View and Manage User Attributes
    - Users can view their attributes (e.g., name, email) fetched directly from AWS Cognito.
    - Attributes are displayed in a table for clarity and accessibility.
3. Update User Information
    - Email Update: Users can update their email address and confirm the change via a verification code sent to their new email.
    - Name Update: Users can update their display name without confirmation.
4. Confirmation Code Handling
    - If an attribute update requires confirmation (e.g., email), users are prompted to enter the verification code sent to their email or phone.
5. Password Management
    - Users can securely change their passwords via the built-in Amplify UI components.
6. Account Deletion
    - Users can delete their account entirely, removing all associated data from AWS Cognito.
