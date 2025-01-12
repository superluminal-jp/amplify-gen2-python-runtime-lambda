# AWS Amplify Gen 2: Account Settings Application

This project demonstrates a Next.js App Router application integrated with AWS Amplify Gen 2 for user account management. It uses AWS Cognito for authentication and provides a user-friendly interface for managing account settings. The application includes features for updating user attributes, handling verification codes, managing passwords, and account deletion. See [AWS Amplify Gen 2](https://docs.amplify.aws/nextjs/build-a-backend/auth/) for more information.

# Authenticator Component

The `<Authenticator>` component in `src/app/layout.tsx` handles Sign-in, Sign-out, and Create Account features. See [AWS Amplify Gen 2 Authenticator](https://docs.amplify.aws/nextjs/build-a-backend/auth/connect-your-frontend/using-the-authenticator/) for more information.

# Account Settings Page

Located at `src/app/account-settings/page.tsx`, this page implements five core features:

1. View and Manage User Attributes
2. Update User Information (email, username)
3. Confirmation Code Handling
4. Password Management
5. Account Deletion

# Key Features

1. User Authentication
    - Secure sign-up, sign-in, and session management through AWS Cognito
    - Complete authentication flow handling via Amplify's Authenticator component
2. User Attributes Management
    - Direct access to view AWS Cognito user attributes (name, email)
    - Clear, accessible table display of attributes
3. Information Updates
    - Email updates with verification code confirmation
    - Instant display name updates without verification
4. Verification Process
    - Verification code system for sensitive attribute changes
    - Email and phone verification support
5. Password Management
    - Secure password changes through Amplify UI components
6. Account Deletion
    - Complete account removal with AWS Cognito data cleanup

# How to Use

1. Launch the development server: `npm run dev`
2. Visit `http://localhost:3000` in your browser
3. Create a new account or log in
4. Access account settings through the sidebar
5. Use the "Delete Account" button in account settings to remove your account
