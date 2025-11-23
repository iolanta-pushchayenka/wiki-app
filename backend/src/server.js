import http from "http";
import { app } from "./app.js";
import { initWebSocket } from "./utils/websocket.js";

const server = http.createServer(app);

initWebSocket(server);

const PORT = 3000;
server.listen(PORT, () => {
    console.log("Server running on", PORT);
});
