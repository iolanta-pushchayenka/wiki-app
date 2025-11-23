import express from "express";
import cors from "cors";
import { UPLOADS_DIR } from "./config.js";

import articlesRouter from "./routes/articles.js";
import attachmentsRouter from "./routes/attachments.js";

export const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));

app.get("/", (req, res) => {
    res.send("API is running");
});

app.use("/articles", articlesRouter);
app.use("/articles", attachmentsRouter);
