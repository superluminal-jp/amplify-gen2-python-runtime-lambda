"use client";

import { Button } from "@aws-amplify/ui-react";

export default function Header({ onSignOut }: { onSignOut: () => void }) {
    return (
        <header className="absolute top-4 right-4">
            <Button onClick={onSignOut}>
                Sign Out
            </Button>
        </header>
    );
}
