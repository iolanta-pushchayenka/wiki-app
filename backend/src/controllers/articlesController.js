import fs from "fs/promises";
import path from "path";
import { DATA_DIR } from "../config.js";
import { makeSafeFilename } from "../utils/safeFileName.js";
import { sendNotification } from "../utils/websocket.js";

// GET all articles
export async function getArticles(req, res) {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        const fileNames = await fs.readdir(DATA_DIR);

        const jsonFiles = fileNames.filter((f) => f.endsWith(".json"));

        const articles = [];
        for (const file of jsonFiles) {
            const filePath = path.join(DATA_DIR, file);
            try {
                const content = await fs.readFile(filePath, "utf8");
                const parsed = JSON.parse(content);

                articles.push({
                    id: path.basename(file, ".json"),
                    title: parsed.title,
                    createdAt: parsed.createdAt,
                });
            } catch { }
        }

        res.json(articles);
    } catch {
        res.status(500).json({ error: "Failed to read articles" });
    }
}

// GET by ID
export async function getArticleById(req, res) {
    try {
        const id = req.params.id;
        const filePath = path.join(DATA_DIR, `${id}.json`);

        const raw = await fs.readFile(filePath, "utf8");
        const parsed = JSON.parse(raw);

        res.json({ id, ...parsed });
    } catch (err) {
        if (err.code === "ENOENT")
            return res.status(404).json({ error: "Article not found" });

        res.status(500).json({ error: "Failed to read article" });
    }
}

// POST create article
export async function createArticle(req, res) {
    try {
        const { title, content } = req.body;

        if (!title || !content)
            return res.status(400).json({ error: "Title and content required" });

        const safe = makeSafeFilename(title);
        const filename = `${safe}.json`;
        const filePath = path.join(DATA_DIR, filename);

        const article = {
            title,
            content,
            createdAt: new Date().toISOString(),
            attachments: [],
        };

        await fs.writeFile(filePath, JSON.stringify(article, null, 2));

        res.status(201).json({
            id: safe,
            ...article,
        });
    } catch {
        res.status(500).json({ error: "Failed to save article" });
    }
}

// DELETE article
export async function deleteArticle(req, res) {
    try {
        const id = req.params.id;
        const filePath = path.join(DATA_DIR, `${id}.json`);

        const raw = await fs.readFile(filePath, "utf8");
        const article = JSON.parse(raw);

        const attachments = article.attachments || [];

        // delete files
        for (const att of attachments) {
            const attPath = path.join("uploads", att.filename);
            await fs.unlink(attPath).catch(() => { });
        }

        await fs.unlink(filePath);

        res.json({
            message: "Article and attachments deleted",
            deletedAttachments: attachments.length,
        });
    } catch (err) {
        if (err.code === "ENOENT")
            return res.status(404).json({ error: "Article not found" });

        res.status(500).json({ error: "Delete error" });
    }
}

// PUT update
export async function updateArticle(req, res) {
    try {
        const id = req.params.id;
        const filePath = path.join(DATA_DIR, `${id}.json`);

        const raw = await fs.readFile(filePath, "utf8");
        const article = JSON.parse(raw);

        const { title, content } = req.body;
        if (!title || !content)
            return res.status(400).json({ error: "Missing fields" });

        const updated = {
            ...article,
            title,
            content,
            updatedAt: new Date().toISOString(),
        };

        await fs.writeFile(filePath, JSON.stringify(updated, null, 2));

        sendNotification(`Article "${title}" updated`);

        res.json(updated);
    } catch (err) {
        if (err.code === "ENOENT")
            return res.status(404).json({ error: "Not found" });

        res.status(500).json({ error: "Update error" });
    }
}
