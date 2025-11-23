import React, { useEffect, useState } from "react";

export default function NotificationToast() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {

    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => console.log("Connected to WebSocket server");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data); 
      setMessages(prev => [...prev, data.message]);

      setTimeout(() => {
        setMessages(prev => prev.filter(msg => msg !== data.message));
      }, 5000);
    };

    ws.onclose = () => console.log("Disconnected from WebSocket");

    return () => ws.close();
  }, []);

  return (
    <div style={{ position: "fixed", top: 10, right: 10, zIndex: 9999 }}>
      {messages.map((msg, idx) => (
        <div key={idx} style={{
          background: "#afeeee",
          padding: "10px 15px",
          marginBottom: "10px",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          minWidth: "200px",
          maxWidth: "300px",
          wordWrap: "break-word"
        }}>
          🔔 {msg}
        </div>
      ))}
    </div>
  );
}
