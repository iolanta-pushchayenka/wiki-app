import express from "express";
import cors from "cors";
import { UPLOADS_DIR } from "./config.js";

import articlesRouter from "./routes/articles.js";
import attachmentsRouter from "./routes/attachments.js";
import commentsRouter from "./routes/comments.js";
import workspacesRouter from "./routes/workspaces.js";
import authRouter from "./routes/auth.js";
import logicRouter from "./routes/logic.js";
import usersRouter from "./routes/users.js"; 


export const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));

app.get("/", (req, res) => {
    res.send("API is running");
});

app.use("/articles", articlesRouter);
app.use("/articles", attachmentsRouter);
app.use("/articles", commentsRouter);


app.use("/workspaces", workspacesRouter);
app.use("/auth", authRouter);
app.use("/logic", logicRouter);
app.use("/users", usersRouter);

