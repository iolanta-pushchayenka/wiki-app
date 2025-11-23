import WebSocket, { WebSocketServer } from "ws";

let clients = [];

export function initWebSocket(server) {
    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws) => {
        clients.push(ws);

        ws.on("close", () => {
            clients = clients.filter((c) => c !== ws);
        });

        ws.on("error", (err) => {
            console.error("WS error:", err);
        });
    });
}

export function sendNotification(message) {
    clients.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ message }));
        }
    });
}
