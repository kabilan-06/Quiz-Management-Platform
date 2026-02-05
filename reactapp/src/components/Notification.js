import React from "react";

export default function Notification({ message, type = "info", onClose }) {
    if (!message) return null;
    const color = type === "success" ? "#38b000" : type === "error" ? "#e63946" : "#3a86ff";
    return (
        <div style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 2000,
            background: color,
            color: "#fff",
            padding: "1.2rem 2rem",
            borderRadius: 16,
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            fontWeight: 600,
            fontSize: "1.1rem",
            minWidth: 220,
            display: "flex",
            alignItems: "center",
            gap: 16
        }}>
            <span>{message}</span>
            {onClose && (
                <button onClick={onClose} style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 18,
                    marginLeft: 16,
                    borderRadius: 8,
                    cursor: "pointer"
                }}>×</button>
            )}
        </div>
    );
}
