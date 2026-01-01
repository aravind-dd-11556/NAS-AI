"use client";

import { useEffect, useState } from "react";

type ToastProps = {
    message: string;
    type?: "success" | "error" | "info";
    duration?: number;
    onClose: () => void;
};

export default function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const backgroundColor =
        type === "success" ? "#4ecdc4" : type === "error" ? "#ff6b6b" : "#333";

    return (
        <div
            style={{
                position: "fixed",
                bottom: "20px",
                left: "50%",
                transform: `translateX(-50%) translateY(${visible ? "0" : "20px"})`,
                opacity: visible ? 1 : 0,
                backgroundColor,
                color: "white",
                padding: "12px 24px",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                zIndex: 1000,
                transition: "all 0.3s ease",
                fontWeight: 500,
                pointerEvents: "none", // Allow clicking through if needed, but usually we want to block interaction only on the toast itself
            }}
        >
            {message}
        </div>
    );
}
