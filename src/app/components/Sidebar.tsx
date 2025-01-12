"use client";
import Link from "next/link";

export default function Sidebar({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    return (
        <>
            <div
                className={`sidebar-overlay ${isOpen ? "visible" : ""}`}
                onClick={onClose}
            ></div>
            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <div className="sidebar-header">
                    <h2>Navigation</h2>
                    <button onClick={onClose}>✕</button>
                </div>
                <Link href="/" className="sidebar-item">
                    Home
                </Link>
                <Link href="/account-settings" className="sidebar-item">
                    Account Settings
                </Link>
            </div>
        </>
    );
}
