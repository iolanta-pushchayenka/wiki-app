import fs from "fs";
import path from "path";

export const DATA_DIR = path.resolve("./data");
export const UPLOADS_DIR = path.resolve("./uploads");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
