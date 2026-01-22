import http from "http";
import { app } from "./src/app.js";
import { initWebSocket } from "./src/utils/websocket.js";
import { PORT } from "./src/config.js";

const server = http.createServer(app);
initWebSocket(server);

server.listen(PORT, () => {
    console.log("Server running on", PORT);
});
