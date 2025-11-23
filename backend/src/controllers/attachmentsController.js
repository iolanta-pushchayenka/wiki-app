import fs from "fs/promises";
import path from "path";
import { DATA_DIR, UPLOADS_DIR } from "../config.js";
import { sendNotification } from "../utils/websocket.js";

export async function uploadAttachment(req, res) {
    try {
        const { id } = req.params;
        const file = req.file;

        if (!file)
            return res.status(400).json({ error: "Файл не загружен" });

        const filePath = path.join(DATA_DIR, `${id}.json`);

        const raw = await fs.readFile(filePath, "utf8");
        const article = JSON.parse(raw);

        const attachment = {
            id: `${Date.now()}-${Math.random()}`,
            originalName: file.originalname,
            filename: file.filename,
            mimeType: file.mimetype,
            size: file.size,
            url: `/uploads/${file.filename}`,
            uploadedAt: new Date().toISOString(),
        };

        article.attachments.push(attachment);

        await fs.writeFile(filePath, JSON.stringify(article, null, 2));

        sendNotification(`New attachment added`);

        res.status(201).json({ message: "OK", attachment });
    } catch (err) {
        return res.status(500).json({ error: "Upload failed" });
    }
}

export async function deleteAttachment(req, res) {
    try {
        const { id, attachmentId } = req.params;

        const filePath = path.join(DATA_DIR, `${id}.json`);
        const raw = await fs.readFile(filePath);
        const article = JSON.parse(raw);

        const index = article.attachments.findIndex((a) => a.id === attachmentId);
        if (index === -1)
            return res.status(404).json({ error: "Attachment not found" });

        const att = article.attachments[index];

        await fs.unlink(path.join(UPLOADS_DIR, att.filename)).catch(() => { });
        article.attachments.splice(index, 1);

        await fs.writeFile(filePath, JSON.stringify(article, null, 2));

        sendNotification(`Attachment deleted`);

        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
}
