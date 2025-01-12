"use client";
import { ToggleButton } from "@aws-amplify/ui-react";
import { MdMenu, MdClose } from "react-icons/md"; // Material Designアイコンを利用

export default function ToggleSidebarButton({
    isOpen,
    onToggle,
}: {
    isOpen: boolean;
    onToggle: () => void;
}) {
    return (
        <ToggleButton
            size="small" // ボタンのサイズを調整
            isPressed={isOpen}
            onClick={onToggle}
            style={{
                position: "fixed",
                left: "16px",
                top: "16px",
            }}
        >
            {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </ToggleButton>
    );
}