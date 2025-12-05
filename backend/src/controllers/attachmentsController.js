import fs from "fs/promises";
import path from "path";
import { DATA_DIR, UPLOADS_DIR } from "../config.js";
import { sendNotification } from "../utils/websocket.js";


import db from "../../models/index.js";
const { Article } = db;


//Upload file for article 
export async function uploadAttachment(req, res) {
    try {
        const { id } = req.params;
        const file = req.file;

        if (!file)
            return res.status(400).json({ error: "The file has not been uploaded" });

        const article = await Article.findByPk(id);

        if(!article)
            return res.status(404).json({error: "Article not found"});

        const attachment = {
            id: `${Date.now()}-${Math.random()}`,
            originalName: file.originalname,
            filename: file.filename,
            mimeType: file.mimetype,
            size: file.size,
            url: `/uploads/${file.filename}`,
            uploadedAt: new Date().toISOString(),
        };

       // добавляем вложение в JSONB массив
        const updated = [...article.attachments, attachment];

        article.attachments = updated;
        await article.save();

        sendNotification(`New attachment added`);

        res.status(201).json({ message: "Attachment uploaded", attachment });

    } catch (err) {
        return res.status(500).json({ error: "Upload failed" });
    }
}


//delete file from article 
export async function deleteAttachment(req, res) {
    try {
        const { id, attachmentId } = req.params;

        const article = await Article.findByPk(id);
        if (!article) {
            return res.status(404).json({error: "Article not found"});
        }
            
        // Ищем вложение в JSONB массиве
        const attachments = article.attachments || [];
        const index = attachments.findIndex(a => a.id === attachmentId);

        if (index === -1) {
            return res.status(404).json({ error: "Attachment not found" });
        }

        const att = attachments[index];

        // Удаляем файл с диска
        const filePath = path.join("uploads", att.filename);
        await fs.unlink(filePath).catch(() => { });

        //Удаляем вложение из массива
        const updated = attachments.filter(a => a.id !== attachmentId);

        article.attachments = updated;
        await article.save();

        sendNotification(`Attachment deleted`);

        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
}
