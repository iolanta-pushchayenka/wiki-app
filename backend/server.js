import http from "http";
import { app } from "./src/app.js";
import { initWebSocket } from "./src/utils/websocket.js";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем .env из backend/.env
dotenv.config({ path: path.resolve(__dirname, "../.env") });


const server = http.createServer(app);

initWebSocket(server);

const PORT = 3000;
server.listen(PORT, () => {
    console.log("Server running on", PORT);
});
