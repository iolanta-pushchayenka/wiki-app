import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

export const JWT_SECRET = process.env.JWT_SECRET;
export const PORT = process.env.PORT || 3000;

export const DATA_DIR = path.resolve("./data");
export const UPLOADS_DIR = path.resolve("./uploads");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
