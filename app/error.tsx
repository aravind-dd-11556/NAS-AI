"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                backgroundColor: "#1a1a1a",
                color: "white",
                gap: "1rem",
                textAlign: "center",
            }}
        >
            <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "#ff6b6b" }}>
                Something went wrong!
            </h2>
            <p style={{ opacity: 0.8 }}>We encountered an unexpected error.</p>
            <button
                onClick={reset}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#4ecdc4",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "bold",
                }}
            >
                Try again
            </button>
        </div>
    );
}
